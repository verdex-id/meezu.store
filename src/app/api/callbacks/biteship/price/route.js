import { FailError } from "@/utils/custom-error";
import { successResponse } from "@/utils/response";
import Joi from " oi";
import { NextResponse } from "next/server";

export async function POST(request) {
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
        courier_driver_photo_url: Joi.string().domain().required(),
        courier_driver_plate_number: Joi.string().required(),
        courier_link: Joi.string().domain().required(),
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

    return NextResponse.json(
        ...successResponse({ nothing: "nothing", req: req }),
    );
}
