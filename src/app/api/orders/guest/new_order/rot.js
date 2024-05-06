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


    let createdOrder;
    let createdInvoice;
    let tripayTransaction;
    await prisma.$transaction(async (tx) => {

      const affected = await tx.$executeRawUnsafe(
        prouductIterationBulkUpdateQuery,
        ...prouductIterationBulkUpdateValues
      );
      if (affected !== invoiceItems.length) {
        throw new FailError("Several records not found for update", 404);
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
    console.log(e);
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
