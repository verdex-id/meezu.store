import prisma, { prismaErrorCode } from "@/lib/prisma";
import { biteshipCallbackSignature } from "@/services/biteship";
import { FailError } from "@/utils/custom-error";
import { orderStatus } from "@/utils/order-status";
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
      courier_link: Joi.string().allow(null),
      updated_at: Joi.string().allow(null),
      status: Joi.string(),
      order_price: Joi.number(),
      order_id: Joi.string(),
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

    let updatedData;
    switch (req.status.toUpperCase()) {
      case "SCHEDULED":
      case "CONFIRMED":
        updatedData = {
          shipment_status: req.status,
          order: {
            update: {
              order_status: orderStatus.awaitingShipment,
            },
          },
        };
        break;
      case "COURIER_NOT_FOUND":
      case "CANCELLED":
      case "REJECTED":
      case "DISPOSED":
      case "RETURNED":
        updatedData = {
          shipment_status: req.status,
          order: {
            update: {
              order_status: orderStatus.awaitingFulfillment,
            },
          },
        };

        break;
      case "ALLOCATED":
      case "PICKING_UP":
        updatedData = {
          shipment_status: req.status,
          order: {
            update: {
              order_status: orderStatus.awaitingPickup,
            },
          },
        };

        break;
      case "PICKED":
      case "DROPPING_OFF":
      case "RETURN_IN_TRANSIT":
        updatedData = {
          shipment_status: req.status,
          order: {
            update: {
              order_status: orderStatus.shipped,
            },
          },
        };
        break;
      case "DELIVERED":
        updatedData = {
          shipment_status: req.status,
          order: {
            update: {
              order_status: orderStatus.arrived,
            },
          },
        };
        break;
      default:
        updatedData = {
          shipment_status: req.status,
        };

        break;
    }

    await prisma.shipment.update({
      where: {
        expedition_order_id: req.order_id,
      },
      data: updatedData,
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
