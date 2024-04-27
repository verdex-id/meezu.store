import prisma, { prismaErrorCode } from "@/lib/prisma";
import { authPayloadAccountId } from "@/middleware";
import {
  createExpeditionOrder,
  retriveAreaDoubleSearch,
} from "@/services/biteship";
import { FailError } from "@/utils/custom-error";
import { orderStatus } from "@/utils/order-status";
import { paymentStatus } from "@/utils/payment-status";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  let response;
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
      is_need_insurance: Joi.boolean().required(),
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

    await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: {
          order_id: req.order_id,
          order_status: orderStatus.awaitingFulfillment,
          invoice: {
            payment_status: paymentStatus.paid,
          },
        },
        data: {
          order_status: orderStatus.awaitingPickup,
        },
        select: {
          shipment: {
            select: {
              shipment_id: true,
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
              gross_price: true,
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

      const insuranceAmount = req.is_need_insurance
        ? updatedOrder.invoice.gross_price
        : 0;

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
        insuranceAmount,
        req.delivery_type,
        deliveryDate,
        deliveryTime,
        req.order_note,
        invoiceItemsToBiteshipItems(updatedOrder.invoice.invoice_item),
      );

      if (!expedition.success) {
        throw new FailError(expedition.error, 400);
      }

      await tx.shipment.update({
        where: {
          shipment_id: updatedOrder.shipment.shipment_id,
        },
        data: {
          expedition_order_id: expedition.id,
          shipment_date: convertToMySQLDatetime(expedition.delivery.datetime),
        },
      });

      response = {
        expedition_order_id: expedition.id,
        expedition_status: expedition.status,
        origin: expedition.origin,
        destination: {
          contact_name: expedition.destination.contact_name,
          contact_phone: expedition.destination.contact_phone,
          contact_email: expedition.destination.contact_email,
          contact_address: expedition.destination.contact_address,
          contact_note: expedition.destination.contact_note,
          postal_code: expedition.destination.postal_code,
        },
        courier: {
          tracking_id: expedition.courier.tracking_id,
          waybill_id: expedition.courier.waybill_id,
          company: expedition.courier.company,
          type: expedition.courier.type,
          insurance: expedition.courier.insurance,
        },
        delivery: expedition.delivery,
        items: expedition.items,
        price: expedition.price,
        note: expedition.note,
      };
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(...failResponse(prismaErrorCode[e.code], 409));
    }

    if (e instanceof FailError) {
      return NextResponse.json(...failResponse(e.message, e.code, e.detail));
    }

    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(...successResponse(response));
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

function convertToMySQLDatetime(datetimeString) {
  const date = new Date(datetimeString);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  const offset = -date.getTimezoneOffset() / 60;
  const offsetHours = Math.floor(offset);
  const offsetMinutes = Math.abs(offset - offsetHours) * 60;
  const offsetSign = offset < 0 ? "-" : "+";
  const offsetHoursString = ("0" + Math.abs(offsetHours)).slice(-2);
  const offsetMinutesString = ("0" + offsetMinutes).slice(-2);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHoursString}:${offsetMinutesString}`;
}
