import prisma, { prismaErrorCode } from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import { generateOrderCode } from "@/utils/random";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import { makeRequestValidation } from "./make-validation";
import { prepareData } from "./prepare-data";
import { makeCourierRates } from "./make-courier-rates";
import { orderStatus } from "@/utils/order-status";
import { makeResponse } from "./make-response";
import { cookies } from "next/headers";

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

    let { invoiceItems, biteshipItems, grossPrice, totalWeight } = datas.datas;

    const shipment = await makeCourierRates(req, biteshipItems);
    if (shipment.error) {
      throw shipment.error;
    }

    grossPrice = grossPrice + shipment.pricing.price;

    let createdOrder;
    await prisma.$transaction(async (tx) => {
      createdOrder = await tx.order.create({
        data: {
          order_code: generateOrderCode(),
          order_status: orderStatus.pending,
          note_for_seller: req.note_for_seller ? req.note_for_seller : null,
          guest_order: {
            create: {
              guest_email: req.guest_email,
              guest_note_for_courier: req.note_for_courier,
            },
          },
          shipment: {
            create: {
              origin_address_id: shipment.origin.origin_address_id,
              destination_area_id: req.guest_area_id,
              courier_id: shipment.courier.courier_id,
              price: shipment.pricing.price,
            },
          },
          invoice: {
            create: {
              customer_full_name: req.guest_full_name,
              customer_phone_number: req.guest_phone_number,
              customer_full_address: req.guest_address,
              discount_amount: 0,
              total_weight: totalWeight,
              shipping_cost: shipment.pricing.price,
              gross_price: grossPrice,
              net_price: grossPrice,
              invoice_item: {
                createMany: {
                  data: invoiceItems,
                },
              },
            },
          },
        },
        select: {
          order_id: true,
          order_code: true,
          order_status: true,
          guest_order: true,
          invoice: {
            include: {
              _count: {
                select: { invoice_item: true },
              },
            },
          },
          shipment: {
            select: {
              price: true,
            },
          },
        },
      });
      response = makeResponse(createdOrder, biteshipItems, shipment.pricing);
      throw new Error("shit");
    });

    const cookie = cookies();
    cookie.set("active_order_code", response.guest_order_code);
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
