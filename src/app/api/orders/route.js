import Joi from "joi";

export async function POST(request) {
    const schema = Joi.object({
        discount_code: Joi.string(),

    })

}
