import prisma, { prismaErrorCode } from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import { orderStatus } from "@/utils/order-status";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  let orders;
  try {
    const schema = Joi.object({
      order_id: Joi.string()
        .pattern(/^[a-z0-9-]{25,}$/)
        .required(),
    });

    let req = schema.validate({
      order_id: params.orderId,
    });
    if (req.error) {
      throw new FailError("invalid request format", 400, req.error.details);
    }
    req = req.value;

    orders = await prisma.order.findUnique({
      where: {
        order_id: req.order_id,
      },
      select: {
        order_status: true,
        order_code: true,
        order_id: true,
        guest_order: {
          select: {
            guest_email: true,
            guest_note_for_courier: true,
          },
        },
        invoice: {
          select: {
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
            courier_tracking_id: true,
            courier_waybill_id: true,
            shipment_status: true,
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

export async function PATCH(request, { params }) {
  let updatedOrder;
  try {
    const schema = Joi.object({
      order_id: Joi.string()
        .pattern(/^[a-z0-9-]{25,}$/)
        .required(),
      new_status: Joi.string()
        .valid(orderStatus.awaitingRefund, orderStatus.awaitingFulfillment)
        .required(),
    });

    let req = await request.json();
    req = schema.validate({
      order_id: params.orderId,
      ...req,
    });
    if (req.error) {
      throw new FailError("invalid request format", 400, req.error.details);
    }
    req = req.value;

    updatedOrder = await prisma.order.update({
      where: {
        order_id: req.order_id,
        order_status: orderStatus.cancellationRequest,
      },
      data: {
        order_status: req.new_status,
      },
      select: {
        order_id: true,
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
