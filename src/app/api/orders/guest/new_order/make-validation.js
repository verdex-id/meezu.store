import { FailError } from "@/utils/custom-error";
import Joi, { valid } from "joi";

export function makeRequestValidation(request) {
  const schema = Joi.object({
    guest_full_name: Joi.string(),
    guest_address: Joi.string().max(200).required(),
    guest_area_id: Joi.string().required(),
    guest_phone_number: Joi.string()
      .pattern(/^(?:\+?62)?[ -]?(?:\d[ -]?){9,15}\d$/)
      .required(),
    guest_email: Joi.string(),
    note_for_courier: Joi.string().max(45),
    note_for_seller: Joi.string().max(150),
    courier_id: Joi.string(),
    payment_method: Joi.string(),
    discount_code: Joi.string(),
    order_items: Joi.array().items(
      Joi.object({
        product_iteration_id: Joi.number().integer().min(0).required(),
        quantity: Joi.number().integer().min(1).required(),
      }),
    ),
  });

  const validationResult = schema.validate(request);

  if (validationResult.error) {
    return {
      request: null,
      error: new FailError(
        "Invalid request format",
        403,
        validationResult.error.details,
      ),
    };
  }

  return {
    request: request,
    error: null,
  };
}

