import prisma, { prismaErrorCode } from "@/lib/prisma";
import { biteshipCallbackSignature } from "@/services/biteship";
import { FailError } from "@/utils/custom-error";
import { unsignedMediumInt } from "@/utils/mysql";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(...successResponse());
}

export async function POST(request) {
  try {
    const cs = headers().get("X-Biteship-Status-Callback");

    console.log(request);
    console.log(cs);

    return NextResponse.json(...successResponse());

    const schema = Joi.object({
      event: Joi.string().valid("order.status").required(),
      courier_tracking_id: Joi.string().required(),
      courier_waybill_id: Joi.string().required(),
      courier_company: Joi.string().required(),
      courier_type: Joi.string().required(),
      courier_driver_name: Joi.string().required(),
      courier_driver_phone: Joi.string()
        .pattern(/^(?:\+?62)?[ -]?(?:\d[ -]?){9,15}\d$/)
        .required(),
      courier_driver_photo_url: Joi.string().uri().required(),
      courier_driver_plate_number: Joi.string().required(),
      courier_link: Joi.string().uri().required(),
      status: Joi.string().required(),
      order_price: Joi.number()
        .min(0)
        .max(unsignedMediumInt)
        .integer()
        .required(),
      order_id: Joi.string()
        .pattern(/^[a-z0-9]{16,}$/)
        .required(),
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
    const callbackSignature = headers().get("X-Biteship-Status-Callback");
    if (signature !== callbackSignature) {
      throw new FailError("Invalid signature", 400);
    }

    await prisma.shipment.update({
      where: {
        expedition_order_id: req.order_id,
      },
      data: {
        shipment_status: req.status,
      },
    });
  } catch (e) {
    console.log(e);
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
