import prisma, { prismaErrorCode } from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import { generateOrderCode } from "@/utils/random";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import { makeShipment } from "./make-shipment";
import { makeDiscount } from "./make-discount";
import { makeTransaction } from "./make-transaction";
import { makeRequestValidation } from "./make-validation";
import { makeInvoiceItemsList } from "./make-invoice-items";
import { makeResponse } from "./make-response";
import { orderStatus } from "@/utils/order-status";
import { paymentStatus } from "@/utils/payment-status";
import { prepareData } from "./prepare-data";

export async function POST(request) {
  let response;
  try {
    let req = makeRequestValidation(await request.json());
    if (req.error) {
      throw req.error;
    }
    req = req.request;

    await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
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

      let invoiceItems = await makeInvoiceItemsList(tx, req);
      if (invoiceItems.error) {
        throw invoiceItems.error;
      }
      invoiceItems = invoiceItems.invoiceItems;

      let { tripayItems, biteshipItems, grossPrice, totalWeight } =
        prepareData(invoiceItems);

      const purchasedItems = [...tripayItems];

      const shipment = await makeShipment(
        tx,
        createdOrder.order_id,
        req,
        biteshipItems,
      );
      if (shipment.error) {
        throw shipment.error;
      }

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

      const tripayTransaction = await makeTransaction(
        req,
        createdOrder.order_code,
        netPrice,
        tripayItems,
      );
      if (tripayTransaction.error) {
        throw tripayTransaction.error;
      }

      await tx.payment.create({
        data: {
          paygate_transaction_id: tripayTransaction.transaction.reference,
          payment_method: tripayTransaction.transaction.payment_method,
          order_id: createdOrder.order_id,
        },
      });

      const createdInvoice = await tx.invoice.create({
        data: {
          payment_status: paymentStatus.unpaid,
          customer_full_name: tripayTransaction.transaction.customer_name,
          customer_phone_number: tripayTransaction.transaction.customer_phone,
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

      response = makeResponse(
        shipment,
        tripayTransaction.transaction,
        createdInvoice,
        purchasedItems,
      );
    });
  } catch (e) {
    console.log(e);
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
