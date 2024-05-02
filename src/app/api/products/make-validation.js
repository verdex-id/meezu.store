import { FailError } from "@/utils/custom-error";
import { unsignedMediumInt, unsignedSmallInt } from "@/utils/mysql";
import Joi from "joi";

export function makeRequestValidation(request) {
  const productIterationSchema = Joi.object({
    product_variant_weight: Joi.number().max(500_000).integer().required(),
    product_variant_price: Joi.number()
      .min(500)
      .max(unsignedMediumInt)
      .integer()
      .required(),
    product_variant_stock: Joi.number()
      .min(0)
      .max(unsignedSmallInt)
      .integer()
      .required(),
    variants: Joi.array().items(
      Joi.object({
        variant_type_name: Joi.string()
          .min(1)
          .max(30)
          .pattern(/^[a-zA-Z0-9\s_()&/\[\].,=-]+$/)
          .required(),
        variant_name: Joi.string()
          .min(1)
          .max(15)
          .pattern(/^[a-zA-Z0-9\s]+$/)
          .required(),
      }),
    ),
  });

  const schema = Joi.object({
    product_category_name: Joi.string().min(3).max(50).required(),
    product_name: Joi.string()
      .pattern(/^[a-zA-Z0-9\s_()&/\[\].,=-]+$/)
      .min(3)
      .max(70)
      .required(),
    product_description: Joi.string().min(3).max(2000).required(),
    product_iterations: Joi.array().items(productIterationSchema),
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
    request: validationResult.value,
    error: null,
  };
}
