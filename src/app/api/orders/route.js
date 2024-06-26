import prisma, { prismaErrorCode } from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import { orderStatus } from "@/utils/order-status";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function GET(request) {
  let order;
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

    order = await prisma.order.findUnique({
      where: {
        order_code: req.order_code,
      },
      select: {
        order_code: true,
        guest_order: {
          select: {
            guest_email: true,
            guest_note_for_courier: true,
          },
        },
        order_status: true,
        invoice: {
          select: {
            payment_status: true,
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
            paygate_transaction_id: true,
          },
        },
        shipment: {
          select: {
            courier_waybill_id: true,
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

    if (!order) {
      throw new FailError(`Order not found`, 404);
    }
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

  return NextResponse.json(...successResponse({ order: order }));
}

export async function PATCH(request) {
  let updatedOrder;
  try {
    const schema = Joi.object({
      order_code: Joi.string()
        .pattern(/^[A-Z0-9-]{27,}$/)
        .required(),
      new_status: Joi.string()
        .valid(orderStatus.cancellationRequest)
        .required(),
    });

    const { searchParams } = new URL(request.url);
    const orderCode = searchParams.get("order_code");

    let req = await request.json();
    req = schema.validate({
      order_code: orderCode,
      ...req,
    });
    if (req.error) {
      throw new FailError("invalid request format", 400, req.error.details);
    }
    req = req.value;

    updatedOrder = await prisma.order.update({
      where: {
        order_code: req.order_code,
        OR: [
          {
            order_status: orderStatus.awaitingFulfillment,
          },
          {
            order_status: orderStatus.awaitingShipment,
          },
        ],
      },
      data: {
        order_status: req.new_status,
      },
      select: {
        order_code: true,
        order_status: true,
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

  return NextResponse.json(...successResponse({ updated_order: updatedOrder }));
}
