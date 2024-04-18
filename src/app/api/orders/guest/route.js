import prisma, { prismaErrorCode } from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import { awaitingPayment } from "@/utils/order-status";
import { generateOrderCode } from "@/utils/random";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import { invoiceItemsListToTripayItems } from "./order-items";
import { makeShipment } from "./make-shipment";
import { makeDiscount } from "./make-discount";
import { makeTransaction } from "./make-transaction";
import { makeRequestValidation } from "./make-validation";
import { makeInvoiceItemsList } from "./make-invoice-items";
import { makeResponse } from "./make-response";

export async function POST(request) {
  let response;
  try {
    let req = makeRequestValidation(await request.json());
    if (req.error) {
      throw req.error;
    }
    req = req.request;

    await prisma.$transaction(async (tx) => {
      const createOrderArg = {
        data: {
          order_status: awaitingPayment,
        },
        select: {
          order_id: true,
        },
      };
      if (req.note_for_seller) {
        createOrderArg.data["note_for_seller"] = req.note_for_seller;
      }
      const createdOrder = await tx.order.create(createOrderArg);

      let invoiceItems = await makeInvoiceItemsList(req);
      if (invoiceItems.error) {
        throw invoiceItems.error;
      }
      invoiceItems = invoiceItems.invoiceItems;

      const tripayItems = invoiceItemsListToTripayItems(invoiceItems);
      const purchasedItems = [...tripayItems];

      const shipment = await makeShipment(
        tx,
        createdOrder.order_id,
        req,
        invoiceItems,
      );
      if (shipment.error) {
        throw shipment.error;
      }

      tripayItems.push({
        name: "Shipping cost",
        price: shipment.pricing.price,
        quantity: 1,
      });

      let grossPrice = invoiceItems.reduce((accu, item) => {
        return accu + item.invoice_item_total_price;
      }, 0);

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

      const totalWeight = invoiceItems.reduce((accu, item) => {
        return accu + item.invoice_item_total_weight;
      }, 0);

      const netPrice = grossPrice - discount;

      const guestOrderArg = {
        data: {
          order_id: createdOrder.order_id,
          order_code: generateOrderCode(),
          guest_email: req.guest_email,
          guest_area_id: req.guest_area_id,
        },
      };

      if (req.note_for_courier) {
        guestOrderArg.data["guest_note_for_courier"] = req.note_for_courier;
      }

      const createdGuestOrder = await tx.guestOrder.create(guestOrderArg);

      const tripayTransaction = await makeTransaction(
        req,
        createdGuestOrder.order_code,
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
      if (e.detail) {
        return NextResponse.json(...failResponse(e.message, e.code, e.detail));
      }
      return NextResponse.json(...failResponse(e.message, e.code));
    }

    return NextResponse.json(...errorResponse());
  }
  return NextResponse.json(...successResponse({ purchase_details: response }));
}
