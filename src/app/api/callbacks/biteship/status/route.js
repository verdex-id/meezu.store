import { FailError } from "@/utils/custom-error";
import { successResponse } from "@/utils/response";
import { join } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function POST(request) {
  const schema = Joi.object({
    event: Joi.string().valid("order.status").required(),
    courier_tracking_id: Joi.string().required(),
    courier_waybill_id: Joi.string().required(),
    courier_company: Joi.string().required(),
    courier_type: Joi.string().required(),
    courier_driver_name: Joi.string().required(),
    courier_driver_phone: Joi.string().required(),
    courier_driver_photo_url: Joi.string().required(),
    courier_driver_plate_number: Joi.string().required(),
    courier_link: Joi.string().required(),
    order_id: Joi.string().required(),
    status: Joi.string().required(),

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

  return NextResponse.json(
    ...successResponse({ nothing: "nothing", req: req }),
  );
}
