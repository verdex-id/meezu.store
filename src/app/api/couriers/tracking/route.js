import prisma, { prismaErrorCode } from "@/lib/prisma";
import { courierTracking } from "@/services/biteship";
import { FailError } from "@/utils/custom-error";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function GET(request) {
  console.log("tisdfjsflk");
  let response;
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
      throw new FailError("Invalid request format", 403, req.error.details);
    }
    req = req.value;

    const order = await prisma.order.findUnique({
      where: {
        order_code: req.order_code,
      },
      select: {
        shipment: {
          select: {
            courier_tracking_id: true,
          },
        },
      },
    });

    const tracking = await courierTracking(order.shipment.courier_tracking_id);

    if (!tracking.success) {
      throw new FailError(expedition.error, 400);
    }

    response = {
      waybill_id: tracking.waybill_id,
      courier: tracking.courier,
      destination: tracking.destination,
      history: tracking.history,
      status: tracking.status,
    };
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
  return NextResponse.json(...successResponse({ tracking: response }));
}
