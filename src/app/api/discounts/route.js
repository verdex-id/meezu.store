import prisma, { prismaErrorCode } from "@/lib/prisma";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";
import { unsignedMediumInt, unsignedSmallInt } from "@/utils/mysql";
import { generateRandomString } from "@/utils/random";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function GET() {
  const discounts = await prisma.discount.findMany({
    select: {
      discount_code: true,
      discount_id: true,
      discount_value: true,
      threshold_discount: true,
      limited_time_discount: true,
      daily_discount: true,
      product_discount: true,
    },
  });

  return NextResponse.json(...successResponse({ discounts }));
}

export async function POST(request) {
  const admin = await fetchAdminIfAuthorized();
  if (admin.error) {
    if (admin.errorCode === 500) {
      return NextResponse.json(...errorResponse());
    }
    return NextResponse.json(...failResponse(admin.error, admin.errorCode));
  }

  const req = await request.json();

  const validationResult = validateDiscountPost(req);

  if (validationResult.error) {
    return NextResponse.json(
      ...failResponse(
        "Invalid request format.",
        403,
        validationResult.error.details,
      ),
    );
  }

  const discountCode = req.discount_code
    ? req.discount_code
    : generateRandomString(8);

  const discountArg = {
    data: {
      discount_code: discountCode,
      discount_value: req.discount_value,
      is_percent_discount: req.is_percent_discount,
      maximum_discount_amount: req.maximum_discount_amount,
      is_limited: req.is_limited_discount,
      usage_limits: req.discount_usage_limits ? req.discount_usage_limits : 0,
      number_of_uses: 0,
    },
    select: {
      discount_code: true,
      discount_value: true,
      usage_limits: true,
      number_of_uses: true,
    },
  };

  if (req.is_product_discount) {
    discountArg.data["product_discount"] = {
      create: {
        product_id: req.product_id,
      },
    };
    discountArg.select["product_discount"] = {
      select: {
        product_id: true,
      },
    };
  }

  if (req.is_threshold_discount) {
    discountArg.data["threshold_discount"] = {
      create: {
        minimum_amount: req.discount_minimum_amount,
      },
    };
    discountArg.select["threshold_discount"] = {
      select: {
        minimum_amount: true,
      },
    };
  }

  if (req.is_limited_time_discount) {
    discountArg.data["limited_time_discount"] = {
      create: {
        from_date: req.from_date,
        to_date: req.to_date,
      },
    };
    discountArg.select["limited_time_discount"] = {
      select: {
        from_date: true,
        to_date: true,
      },
    };
  }

  if (req.is_daily_discount) {
    discountArg.data["daily_discount"] = {
      create: {
        from_hour: req.from_hour,
        to_hour: req.to_hour,
      },
    };
    discountArg.select["daily_discount"] = {
      select: {
        from_hour: true,
        to_hour: true,
      },
    };
  }

  let discount;
  try {
    discount = await prisma.discount.create(discountArg);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        ...failResponse(prismaErrorCode[e.code], 409, e.meta.target),
      );
    }
    return NextResponse.json(...errorResponse());
  }
  return NextResponse.json(...successResponse({ discount }));
}

function validateDiscountPost(request) {
  const schema = Joi.object({
    discount_code: Joi.string().min(3).max(35),
    is_percent_discount: Joi.boolean().required(),
    discount_value: Joi.alternatives().conditional("discount_is_percent", {
      is: true,
      then: Joi.number().min(1).max(100).integer().required(),
      otherwise: Joi.number()
        .min(500)
        .max(unsignedMediumInt)
        .integer()
        .required(),
    }),
    maximum_discount_amount: Joi.alternatives().conditional(
      "is_percent_discount",
      {
        is: true,
        then: Joi.number().min(500).max(unsignedMediumInt).integer().required(),
        otherwise: Joi.number().min(500).max(unsignedMediumInt).integer(),
      },
    ),

    is_product_discount: Joi.boolean().required(),
    product_id: Joi.alternatives().conditional("is_product_discount", {
      is: true,
      then: Joi.number().min(1).integer().required(),
      otherwise: Joi.number().min(1).integer(),
    }),

    is_limited_discount: Joi.boolean().required(),
    discount_usage_limits: Joi.alternatives().conditional(
      "is_limited_discount",
      {
        is: true,
        then: Joi.number().min(1).max(unsignedSmallInt).integer().required(),
        otherwise: Joi.number().min(1).max(unsignedSmallInt).integer(),
      },
    ),

    is_threshold_discount: Joi.boolean().required(),
    discount_minimum_amount: Joi.alternatives().conditional(
      "is_threshold_discount",
      {
        is: true,
        then: Joi.number().min(500).max(unsignedMediumInt).integer().required(),
        otherwise: Joi.number().min(500).max(unsignedMediumInt).integer(),
      },
    ),

    is_limited_time_discount: Joi.boolean().required(),
    from_date: Joi.alternatives().conditional("is_limited_time_discount", {
      is: true,
      then: Joi.date().iso().min("now").required(),
      otherwise: Joi.date().iso().min("now"),
    }),
    to_date: Joi.alternatives().conditional("is_limited_time_discount", {
      is: true,
      then: Joi.date().iso().greater(Joi.ref("from_date")).required(),
      otherwise: Joi.date().iso().greater(Joi.ref("from_date")),
    }),

    is_daily_discount: Joi.boolean().required(),
    from_hour: Joi.alternatives().conditional("is_daily_discount", {
      is: true,
      then: Joi.number().integer().min(0).max(23).required(),
      otherwise: Joi.number().integer().min(0).max(23),
    }),
    to_hour: Joi.alternatives().conditional("is_daily_discount", {
      is: true,
      then: Joi.number()
        .integer()
        .greater(Joi.ref("from_hour"))
        .min(0)
        .max(23)
        .required(),
      otherwise: Joi.number()
        .integer()
        .greater(Joi.ref("from_hour"))
        .min(0)
        .max(23),
    }),
  });

  const result = schema.validate(request);
  return result;
}
