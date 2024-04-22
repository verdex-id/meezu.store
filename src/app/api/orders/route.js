import prisma, { prismaErrorCode } from "@/lib/prisma";
import { authPayloadAccountId } from "@/middleware";
import { cetak } from "@/utils/cetak";
import { FailError } from "@/utils/custom-error";
import { orderStatus } from "@/utils/order-status";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const payloadAdminId = headers().get(authPayloadAccountId);

  let admin = await prisma.admin.findUnique({
    where: {
      admin_id: payloadAdminId,
    },
  });

  if (!admin) {
    return NextResponse.json(...errorResponse());
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
    return NextResponse.json(
      ...failResponse("Invalid request format", 400, req.error.details),
    );
  }
  req = req.value;

  let orders;
  try {
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

    cetak(orders, "PAID ORDERS", true);
  } catch (e) {
    cetak(e, "E orders/get");
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(...failResponse(prismaErrorCode[e.code], 409));
    }

    if (e instanceof FailError) {
      return NextResponse.json(...failResponse(e.message, e.code, e.detail));
    }

    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(...successResponse({ orders: orders }));
}
