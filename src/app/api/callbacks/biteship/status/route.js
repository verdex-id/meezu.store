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
  const callbackSignature = headers().get("X-Biteship-Status-Callback");
  try {
    const schema = Joi.object({
      event: Joi.string().valid("order.status").required(),
      courier_tracking_id: Joi.string(),
      courier_waybill_id: Joi.string(),
      courier_company: Joi.string(),
      courier_type: Joi.string(),
      courier_driver_name: Joi.string(),
      courier_driver_phone: Joi.string(),
      courier_driver_photo_url: Joi.string(),
      courier_driver_plate_number: Joi.string(),
      courier_link: Joi.string(),
      status: Joi.string(),
      order_price: Joi.number(),
      order_id: Joi.string(),
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

    //switch (req.status.toUpperCase()) {
    //  case "ALLOCATED":
    //    error = await makePaidStatus(order);
    //    break;
    //  case "EXPIRED":
    //    error = await makeFailedStatus(order);
    //    break;
    //  case "FAILED":
    //    error = await makeFailedStatus(order);
    //    break;
    //  case "REFUND":
    //    error = await makeRefundStatus(order);
    //    break;
    //  default:
    //    throw new FailError("Unrecognized payment status", 400);
    //}

    await prisma.shipment.update({
      where: {
        expedition_order_id: req.order_id,
      },
      data: {
        shipment_status: req.status,
      },
    });
  } catch (e) {
    if (e instanceof SyntaxError) {
      // callback registration check
      const content = {
        event: "order.status",
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
