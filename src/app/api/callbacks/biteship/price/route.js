import prisma, { prismaErrorCode } from "@/lib/prisma";
import { biteshipCallbackSignature } from "@/services/biteship";
import { FailError } from "@/utils/custom-error";
import { unsignedMediumInt } from "@/utils/mysql";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const callbackSignature = headers().get("X-Biteship-Price-Callback");
  try {
    const schema = Joi.object({
      event: Joi.string().valid("order.price").required(),
      order_id: Joi.string()
        .pattern(/^[a-z0-9]{16,}$/)
        .required(),
      status: Joi.string().required(),
      courier_tracking_id: Joi.string().required(),
      courier_waybill_id: Joi.string().required(),
      price: Joi.number().min(0).max(unsignedMediumInt).integer().required(),
      updated_at: Joi.string().allow(null),
      cash_on_delivery_fee: Joi.number()
        .min(0)
        .max(unsignedMediumInt)
        .integer()
        .required(),
      proof_of_delivery_fee: Joi.number()
        .min(0)
        .max(unsignedMediumInt)
        .integer()
        .required(),
      shippment_fee: Joi.number()
        .min(0)
        .max(unsignedMediumInt)
        .integer()
        .required(),
    });
    let req = await request.json();

    console.log(req);
    console.log(callbackSignature);
    req = schema.validate(req);
    if (req.error) {
      console.log(req.error.details);
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
        cash_on_delivery_fee: req.cash_on_delivery_fee,
        proof_of_delivery_fee: req.proof_of_delivery_fee,
        shippment_fee: req.shippment_fee,
        price: req.price,
      },
    });
  } catch (e) {
    if (e instanceof SyntaxError) {
      // callback registration check
      const content = {
        event: "order.price",
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
