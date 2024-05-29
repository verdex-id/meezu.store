import prisma, { prismaErrorCode } from "@/lib/prisma";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";
import { FailError } from "@/utils/custom-error";
import { orderStatus } from "@/utils/order-status";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  let updatedOrder;
  try {
    const admin = await fetchAdminIfAuthorized();
    if (admin.error) {
      throw new FailError(admin.error, admin.errorCode);
    }

    const schema = Joi.object({
      order_id: Joi.string()
        .pattern(/^[a-z0-9-]{25,}$/)
        .required(),
      new_status: Joi.string().valid(orderStatus.completed).required(),
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
        order_status: orderStatus.arrived,
        shipment: {
          shipment_status: "delivered",
        },
      },
      data: {
        order_status: req.new_status,
      },
      select: {
        order_id: true,
        order_code: true,
        order_status: true,
        shipment: {
          select: {
            shipment_status: true,
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

  return NextResponse.json(...successResponse({ updated_order: updatedOrder }));
}
