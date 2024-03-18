import Joi from "joi";

export async function POST(request) {
    const schema = Joi.object({
        guest_full_name: Joi.string(),
        guest_phone_number: Joi.string(),
        guest_email: Joi.string(),
        guest_address: Joi.string(),
        discount_code: Joi.string(),
        payment_method:


    })

}
