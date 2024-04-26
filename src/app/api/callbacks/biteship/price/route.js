import { FailError } from "@/utils/custom-error";
import { successResponse } from "@/utils/response";
import Joi from " oi";
import { NextResponse } from "next/server";

export async function POST(request) {
    const schema = Joi.object({
        event: Joi.string().valid("order.price").required(),
        order_id: Joi.string()
            .pattern(/^[a-z0-9]{16,}$/)
            .required(),
        status: Joi.string().required(),
        courier_tracking_id: Joi.string().required(),
        courier_waybill_id: Joi.string().required(),
        price: Joi.number()
            .min(0)
            .max(unsignedMediumInt)
            .integer()
            .required(),
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
    req = schema.validate(req);
    if (req.error) {
        throw new FailError("Invalid request format.", 403, req.error.details);
    }
    req = req.value;

    return NextResponse.json(
        ...successResponse({ nothing: "nothing", req: req }),
    );
}
