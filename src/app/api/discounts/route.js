import { unsignedMediumInt, unsignedSmallInt } from "@/utils/size";
import Joi from "joi";

export async function POST() {
  const schema = Joi.object({
    discount_value: Joi.number()
      .min(1)
      .max(unsignedMediumInt)
      .integer()
      .required(),
    is_percent_discount: Joi.boolean().required(),
    maximum_discount_amount: Joi.number()
      .min(1000)
      .max(unsignedMediumInt)
      .integer()
      .required(),
    is_limited: Joi.boolean().required(),
    usage_limit: Joi.number().min(1).max(unsignedSmallInt),

    minimum_amount: Joi.number().min(1000).max(unsignedMediumInt).integer(),

    from_date: Joi.date().iso().min("now"),
    to_date: Joi.date().iso().greater(Joi.ref("from_date")),

    from_hour: Joi.number().integer().min(0).max(23),
    to_hour: Joi.number()
      .integer()
      .greater(Joi.ref("from_hour"))
      .min(0)
      .max(23),

    product_id: Joi.number().integer(),
  });


}
