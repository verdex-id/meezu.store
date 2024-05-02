import prisma, { prismaErrorCode } from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function GET(request) {
  let orders;
  try {
    const schema = Joi.object({
      order_code: Joi.string()
        .pattern(/^[A-Z0-9-]{27,}$/)
        .required(),
    });

    const { searchParams } = new URL(request.url);
    const orderCode = searchParams.get("order_code");

    let req = schema.validate({
      order_code: orderCode,
    });
    if (req.error) {
      throw new FailError("invalid request format", 400, req.error.details);
    }
    req = req.value;

    orders = await prisma.order.findUnique({
      where: {
        order_code: req.order_code,
      },
      select: {
        guest_order: true,
        order_status: true,
        invoice: {
          select: {
            invoice_id: true,
            payment_date: true,
            customer_full_address: true,
            gross_price: true,
            shipping_cost: true,
            discount_amount: true,
            net_price: true,
            invoice_item: {
              select: {
                invoice_item_name: true,
                invoice_item_quantity: true,
                invoice_item_price: true,
                invoice_item_total_price: true,
              },
            },
          },
        },
        payment: {
          select: {
            payment_method: true,
          },
        },
        shipment: {
          select: {
            courier_tracking_id: true,
            courier: {
              select: {
                courier_name: true,
                courier_service_name: true,
              },
            },
          },
        },
      },
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
      return NextResponse.json(...failResponse(e.message, e.code, e.detail));
    }

    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(...successResponse({ orders: orders }));
}
