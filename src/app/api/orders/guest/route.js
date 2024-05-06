import prisma, { prismaErrorCode } from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import { generateOrderCode } from "@/utils/random";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import { makeDiscount } from "./make-discount";
import { makeTransaction } from "./make-transaction";
import { makeRequestValidation } from "./make-validation";
import { makeResponse } from "./make-response";
import { orderStatus } from "@/utils/order-status";
import { paymentStatus } from "@/utils/payment-status";
import { prepareData } from "./prepare-data";
import { makeCourierRates } from "./make-courier-rates";

export async function POST(request) {
  let response;
  try {
    let req = makeRequestValidation(await request.json());
    if (req.error) {
      throw req.error;
    }
    req = req.request;

    const datas = await prepareData(req);
    if (datas.error) {
      throw datas.error;
    }

    let {
      invoiceItems,
      tripayItems,
      biteshipItems,
      grossPrice,
      totalWeight,
      prouductIterationBulkUpdateQuery,
      prouductIterationBulkUpdateValues,
    } = datas.datas;
    const purchasedItems = [...tripayItems];

    const shipment = await makeCourierRates(req, biteshipItems);
    if (shipment.error) {
      throw shipment.error;
    }

    let createdOrder;
    let createdInvoice;
    let tripayTransaction;
    await prisma.$transaction(async (tx) => {
      createdOrder = await tx.order.create({
        data: {
          order_code: generateOrderCode(),
          order_status: orderStatus.awaitingPayment,
          note_for_seller: req.note_for_seller ? req.note_for_seller : null,
          discount_code: req.discount_code ? req.discount_code : null,
        },
        select: {
          order_id: true,
          order_code: true,
        },
      });
      await tx.guestOrder.create({
        data: {
          order_id: createdOrder.order_id,
          guest_email: req.guest_email,
          guest_note_for_courier: req.note_for_courier,
        },
      });

      const affected = await tx.$executeRawUnsafe(
        prouductIterationBulkUpdateQuery,
        ...prouductIterationBulkUpdateValues
      );
      if (affected !== invoiceItems.length) {
        throw new FailError("Several records not found for update", 404);
      }

      await tx.shipment.create({
        data: {
          origin_address_id: shipment.origin.origin_address_id,
          destination_area_id: req.guest_area_id,
          courier_id: shipment.courier.courier_id,
          order_id: createdOrder.order_id,
        },
      });

      tripayItems.push({
        name: "Shipping cost",
        price: shipment.pricing.price,
        quantity: 1,
      });

      let discount = 0;
      if (req.discount_code) {
        discount = await makeDiscount(tx, req.discount_code, grossPrice);

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

      grossPrice = grossPrice + shipment.pricing.price;

      const netPrice = grossPrice - discount;

      createdInvoice = await tx.invoice.create({
        data: {
          payment_status: paymentStatus.unpaid,
          customer_full_name: req.guest_full_name,
          customer_phone_number: req.guest_phone_number,
          customer_full_address: req.guest_address,
          discount_amount: discount,
          total_weight: totalWeight,
          shipping_cost: shipment.pricing.price,
          gross_price: grossPrice,
          net_price: netPrice,
          invoice_item: {
            createMany: {
              data: invoiceItems,
            },
          },
          order_id: createdOrder.order_id,
        },
        include: {
          _count: {
            select: { invoice_item: true },
          },
        },
      });

      tripayTransaction = await makeTransaction(
        req,
        createdOrder.order_code,
        netPrice,
        tripayItems
      );
      if (tripayTransaction.error) {
        throw new FailError(
          "There was an error processing your payment. Please try again later or contact support for assistance.",
          500
        );
      }
    });

    await prisma.payment.create({
      data: {
        paygate_transaction_id: tripayTransaction.transaction.reference,
        payment_method: tripayTransaction.transaction.payment_method,
        order_id: createdOrder.order_id,
      },
    });

    response = makeResponse(
      shipment.pricing,
      tripayTransaction.transaction,
      createdInvoice,
      purchasedItems
    );
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return NextResponse.json(
          ...failResponse(`${e.meta.modelName} not found`, 404)
        );
      }
      return NextResponse.json(
        ...failResponse(prismaErrorCode[e.code], 409, e.meta.modelName)
      );
    }

    if (e instanceof FailError) {
      return NextResponse.json(...failResponse(e.message, e.code, e.detail));
    }

    return NextResponse.json(...errorResponse());
  }
  return NextResponse.json(...successResponse({ purchase_details: response }));
}
