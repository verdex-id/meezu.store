import prisma, { prismaErrorCode } from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import Joi from "joi";
import { makeDiscount } from "./make-discount";
import { makeTransaction } from "./make-transaction";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { NextResponse } from "next/server";
import { prepareData } from "./prepare-data";
import { orderStatus } from "@/utils/order-status";
import { makeResponse } from "./make-response";
import { sendEmail } from "@/services/email";
import { emailHTML, emailText } from "./make-email";
import { cookies } from "next/headers";

export async function POST(request) {
  let response;
  try {
    const schema = Joi.object({
      order_code: Joi.string()
        .pattern(/^[A-Z0-9-]{27,}$/)
        .required(),
      payment_method: Joi.string()
        .pattern(/^[A-Z_]+$/)
        .required(),
      discount_code: Joi.string(),
    });

    const { searchParams } = new URL(request.url);
    const orderCode = searchParams.get("order_code");
    let req = await request.json();

    req = schema.validate({
      order_code: orderCode,
      ...req,
    });
    if (req.error) {
      throw new FailError("Invalid request format", 403, req.error.details);
    }
    req = req.value;

    const order = await prisma.order.findUnique({
      where: {
        order_code: req.order_code,
        order_status: orderStatus.incomplete,
      },
      select: {
        order_id: true,
        order_code: true,
        guest_order: {
          select: {
            guest_email: true,
          },
        },
        invoice: {
          select: {
            customer_full_name: true,
            customer_phone_number: true,
            customer_full_address: true,
            invoice_id: true,
            gross_price: true,
            shipping_cost: true,
            invoice_item: true,
          },
        },
        shipment: {
          select: {
            courier: true,
          },
        },
      },
    });

    if (!order) {
      throw new FailError("Order not found", 404);
    }

    const datas = await prepareData(order.invoice.invoice_item);
    if (datas.error) {
      throw datas.error;
    }
    let {
      tripayItems,
      prouductIterationBulkUpdateQuery,
      prouductIterationBulkUpdateValues,
    } = datas.datas;
    const purchasedItems = [...tripayItems];

    tripayItems.push({
      name: "Shipping cost",
      price: order.invoice.shipping_cost,
      quantity: 1,
    });

    let updatedInvoice;
    let tripayTransaction;
    await prisma.$transaction(async (tx) => {
      const affected = await tx.$executeRawUnsafe(
        prouductIterationBulkUpdateQuery,
        ...prouductIterationBulkUpdateValues,
      );
      if (affected !== order.invoice.invoice_item.length) {
        throw new FailError("Several records not found for update", 404);
      }

      let discount = 0;
      if (req.discount_code) {
        discount = await makeDiscount(
          tx,
          req.discount_code,
          order.invoice.gross_price,
        );

        if (discount.error) {
          throw discount.error;
        }

        discount = discount.amount;

        tripayItems.push({
          name: "Discount",
          price: -discount,
          quantity: 1,
        });
      }

      const netPrice =
        order.invoice.gross_price + order.invoice.shipping_cost - discount;

      updatedInvoice = await tx.invoice.update({
        where: {
          invoice_id: order.invoice.invoice_id,
        },
        data: {
          discount_amount: discount,
          net_price: netPrice,
          order: {
            update: {
              order_status: orderStatus.awaitingPayment,
            },
          },
        },
      });

      tripayTransaction = await makeTransaction(
        order,
        req.payment_method,
        updatedInvoice.net_price,
        tripayItems,
      );
      if (tripayTransaction.error) {
        throw new FailError(
          "There was an error processing your payment. Please try again later or contact support for assistance.",
          500,
        );
      }
    });

    await prisma.payment.create({
      data: {
        paygate_transaction_id: tripayTransaction.transaction.reference,
        payment_method: tripayTransaction.transaction.payment_method,
        order_id: order.order_id,
      },
    });

    response = makeResponse(
      order,
      updatedInvoice,
      tripayTransaction.transaction,
      purchasedItems,
    );

    const expireTime = new Date(
      tripayTransaction.transaction.expired_time * 1000,
    ).toLocaleString();

    const formatedPrice = updatedInvoice.net_price
      .toLocaleString()
      .replace(/,/g, ".");

    sendEmail(
      order.guest_order.guest_email,
      "Customer order",
      emailText(order.order_code, formatedPrice, expireTime),
      emailHTML(order.order_code, formatedPrice, expireTime),
    );

    const cookie = cookies();
    cookie.delete("active_order_code");
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return NextResponse.json(
          ...failResponse(`${e.meta.modelName} not found`, 404),
        );
      }
      return NextResponse.json(
        ...failResponse(prismaErrorCode[e.code], 409, e.meta.modelName),
      );
    }

    if (e instanceof FailError) {
      return NextResponse.json(...failResponse(e.message, e.code, e.detail));
    }
    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(...successResponse({ purchase_details: response }));
}
