import prisma, { prismaErrorCode } from "@/lib/prisma";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";
import { FailError } from "@/utils/custom-error";
import { orderStatus } from "@/utils/order-status";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function GET(request) {
  let orders;
  try {
    const admin = await fetchAdminIfAuthorized();
    if (admin.error) {
      throw new FailError(admin.error, admin.errorCode);
    }

    const schema = Joi.object({
      status: Joi.string()
        .pattern(/^[a-z_]+$/)
        .required(),
    });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let req = schema.validate({
      status: status,
    });
    if (req.error) {
      throw new FailError("Invalid request format", 400, req.error.details);
    }
    req = req.value;

    const query = [];
    switch (req.status) {
      case "all_order":
        query.push(
          orderStatus.awaitingFulfillment,
          orderStatus.awaitingPickup,
          orderStatus.shipped,
          orderStatus.arrived,
          orderStatus.completed,
          orderStatus.cancellationRequest,
          orderStatus.awaitingRefund,
          orderStatus.refunded,
        );
        break;
      case "new_order":
        query.push(orderStatus.awaitingFulfillment);
        break;
      case "confirm_shipping":
        query.push(orderStatus.awaitingPickup);
        break;
      case "in_shipping":
        query.push(orderStatus.shipped);
        break;
      case "arrived":
        query.push(orderStatus.arrived);
        break;
      case "done":
        query.push(orderStatus.completed);
        break;
      case "cancellation_request":
        query.push(orderStatus.cancellationRequest);
        break;
      case "awaiting_refund":
        query.push(orderStatus.awaitingRefund);
        break;
      case "refund":
        query.push(orderStatus.refunded);
        break;
      default:
        throw new FailError("Unrecognized status", 400);
    }

    orders = await prisma.order.findMany({
      where: {
        order_status: {
          in: query,
        },
      },
      select: {
        order_status: true,
        order_code: true,
        invoice: {
          select: {
            customer_full_name: true,
            payment_date: true,
            payment_status: true,
            invoice_item: {
              orderBy: { invoice_item_total_price: "asc" },
              take: 1,
              select: {
                invoice_item_name: true,
              },
            },
          },
        },
        shipment: {
          select: {
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

export async function PATCH(request) {
  let updatedOrder;
  try {
    const schema = Joi.object({
      order_code: Joi.string()
        .pattern(/^[A-Z0-9-]{27,}$/)
        .required(),
      new_status: Joi.string().valid(orderStatus.awaitingRefund).required(),
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
        order_status: orderStatus.cancellationRequest,
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
