import prisma, { prismaErrorCode } from "@/lib/prisma";
import { biteshipCallbackSignature } from "@/services/biteship";
import { FailError } from "@/utils/custom-error";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const callbackSignature = headers().get("X-Biteship-Waybill-Callback");
  try {
    const schema = Joi.object({
      event: Joi.string().valid("order.waybill_id").required(),
      order_id: Joi.string()
        .pattern(/^[a-z0-9]{16,}$/)
        .required(),
      status: Joi.string().required(),
      courier_tracking_id: Joi.string().required(),
      courier_waybill_id: Joi.string().required(),
    });
    let req = await request.json();

    req = schema.validate(req);
    if (req.error) {
      throw new FailError("Invalid request format.", 403, req.error.details);
    }
    req = req.value;

    const content = {
      event: req.event,
    };
    const signature = biteshipCallbackSignature(content);
    if (signature !== callbackSignature) {
      throw new FailError("Invalid signature", 400);
    }

    await prisma.shipment.update({
      where: {
        expedition_order_id: req.order_id,
      },
      data: {
        courier_waybill_id: req.courier_waybill_id,
      },
    });
  } catch (e) {
    if (e instanceof SyntaxError) {
      // callback registration check
      const content = {
        event: "order.waybill_id",
      };
      const signature = biteshipCallbackSignature(content);

      if (signature !== callbackSignature) {
        return NextResponse.json(...failResponse("Invalid signature", 400));
      }

      return NextResponse.json(...successResponse());
    }

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

  return NextResponse.json(...successResponse());
}
