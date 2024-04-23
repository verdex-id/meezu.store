import prisma, { prismaErrorCode } from "@/lib/prisma";
import { authPayloadAccountId } from "@/middleware";
import {
  createExpeditionOrder,
  retriveAreaDoubleSearch,
} from "@/services/biteship";
import { cetak } from "@/utils/cetak";
import { FailError } from "@/utils/custom-error";
import { unsignedMediumInt } from "@/utils/mysql";
import { orderStatus } from "@/utils/order-status";
import { errorResponse, failResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const payloadAdminId = headers().get(authPayloadAccountId);
    let admin = await prisma.admin.findUnique({
      where: {
        admin_id: payloadAdminId,
      },
    });
    if (!admin) {
      throw new Error("can't find admin record");
    }

    const schema = Joi.object({
      order_id: Joi.string()
        .pattern(/^[a-z0-9]{16,}$/)
        .required(),
      note_for_courier: Joi.string().max(45),
      courier_insurance_amount: Joi.number()
        .min(500)
        .max(unsignedMediumInt)
        .integer(),
      delivery_type: Joi.string().valid("now", "later", "scheduled").required(),
      delivery_date: Joi.alternatives().conditional("delivery_type", {
        is: "now",
        then: Joi.date().iso().min("now"),
        otherwise: Joi.date().iso().min("now").required(),
      }),
      order_note: Joi.string(),
    });

    let req = await request.json();
    req = schema.validate(req);
    if (req.error) {
      throw new FailError("Invalid request format.", 403, req.error.details);
    }
    req = req.value;

    const isoDate = new Date(req.delivery_date);
    const deliveryDate = isoDate.toISOString().split("T")[0];
    const deliveryTime = isoDate
      .toTimeString()
      .split(" ")[0]
      .split(":")
      .slice(0, 2)
      .join(":");

    cetak(req, "REQ", true);
    cetak(deliveryDate, "delivery_date", true);
    cetak(deliveryTime, "delivery_time", true);

    await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: {
          order_id: req.order_id,
        },
        data: {
          order_status: orderStatus.awaitingPickup,
        },
        select: {
          shipment: {
            select: {
              destination_area_id: true,
              origin_address: {
                select: {
                  phone_number: true,
                  address: true,
                  area_id: true,
                  postal_code: true,
                },
              },
              courier: {
                select: {
                  courier_code: true,
                  courier_service_code: true,
                },
              },
            },
          },
          invoice: {
            select: {
              customer_full_name: true,
              customer_phone_number: true,
              customer_full_address: true,
              invoice_item: {
                select: {
                  invoice_item_name: true,
                  invoice_item_price: true,
                  invoice_item_quantity: true,
                  invoice_item_weight: true,
                },
              },
            },
          },
          guest_order: {
            select: {
              guest_note_for_courier: true,
              guest_email: true,
            },
          },
        },
      });

      const destination = await retriveAreaDoubleSearch(
        updatedOrder.shipment.destination_area_id,
      );

      if (destination.error) {
        throw new Error("can't retrive destination address information", 500);
      }

      const expedition = await createExpeditionOrder(
        admin.admin_full_name,
        updatedOrder.shipment.origin_address.phone_number,
        updatedOrder.shipment.origin_address.address,
        req.note_for_courier,
        updatedOrder.shipment.origin_address.area_id,
        updatedOrder.shipment.origin_address.postal_code,

        updatedOrder.invoice.customer_full_name,
        updatedOrder.invoice.customer_phone_number,
        updatedOrder.invoice.customer_full_address,
        updatedOrder.guest_order.guest_email,
        updatedOrder.guest_order.guest_note_for_courier,
        updatedOrder.shipment.destination_area_id,
        destination.area.postal_code,

        updatedOrder.shipment.courier.courier_code,
        updatedOrder.shipment.courier.courier_service_code,
        req.courier_insurance_amount,
        req.delivery_type,
        deliveryDate,
        deliveryTime,
        req.order_note,
        invoiceItemsToBiteshipItems(updatedOrder.invoice.invoice_item),
      );

      cetak(expedition, "EXPED");
      throw new Error("SHIT");
    });
  } catch (e) {
    cetak(e, "E shipment/route");
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(...failResponse(prismaErrorCode[e.code], 409));
    }

    if (e instanceof FailError) {
      return NextResponse.json(...failResponse(e.message, e.code, e.detail));
    }

    return NextResponse.json(...errorResponse());
  }
}

function invoiceItemsToBiteshipItems(invoiceItems) {
  const biteshipItemList = invoiceItems.map((item) => ({
    name: item.invoice_item_name,
    value: item.invoice_item_price,
    weight: item.invoice_item_weight,
    quantity: item.invoice_item_quantity,
  }));

  return biteshipItemList;
}
