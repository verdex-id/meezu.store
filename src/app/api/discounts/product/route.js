import prisma, { prismaErrorCode } from "@/lib/prisma";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";
import { ErrorWithCode } from "@/utils/custom-error";
import { unsignedMediumInt } from "@/utils/mysql";
import { generateRandomString } from "@/utils/random";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function GET() {
  const admin = await fetchAdminIfAuthorized();
  if (admin.error) {
    if (admin.errorCode === 500) {
      return NextResponse.json(...errorResponse());
    }
    return NextResponse.json(...failResponse(admin.error, admin.errorCode));
  }

  const discounts = await prisma.discount.findMany({
    where: {
      product_discount: { isNot: null },
    },
    select: {
      discount_code: true,
      discount_id: true,
      discount_value: true,
      product_discount: {
        select: {
          product: {
            select: {
              product_id: true,
              product_slug: true,
              product_name: true,
              product_iterations: {
                orderBy: { product_variant_price: "asc" },
                take: 1,
                select: {
                  product_iteration_id: true,
                  product_variant_price: true,
                },
              },
            },
          },
        },
      },
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

  const validationResult = validateDiscountProductPost(req);

  if (validationResult.error) {
    return NextResponse.json(
      ...failResponse(
        "Invalid request format.",
        403,
        validationResult.error.details,
      ),
    );
  }

  const discountArg = {
    data: {
      discount_code: generateRandomString(8),
      discount_value: req.discount_value,
      is_percent_discount: req.is_percent_discount,
      maximum_discount_amount: 0,
      is_limited: false,
      number_of_uses: 0,
      usage_limits: 0,
      product_discount: {
        create: {
          product_id: req.product_id,
        },
      },
    },
    select: {
      discount_code: true,
      discount_value: true,
      is_percent_discount: true,
      maximum_discount_amount: true,
      is_limited: false,
      product_discount: {
        select: {
          product_id: true,
        },
      },
    },
  };

  let discount;
  try {
    const product = await prisma.product.findUnique({
      where: {
        product_id: req.product_id,
      },
      select: { product_id: true, product_discounts: true },
    });

    if (!product) {
      throw new ErrorWithCode("Product not found", 404);
    }

    if (product.product_discounts) {
      throw new ErrorWithCode("Product already have discount", 409);
    }

    discount = await prisma.discount.create(discountArg);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        ...failResponse(prismaErrorCode[e.code], 409, e.meta.target),
      );
    }

    if (e instanceof ErrorWithCode) {
      return NextResponse.json(...failResponse(e.message, e.code));
    }

    return NextResponse.json(...errorResponse());
  }
  return NextResponse.json(...successResponse({ discount }));
}

function validateDiscountProductPost(request) {
  const schema = Joi.object({
    is_percent_discount: Joi.boolean().required(),
    discount_value: Joi.alternatives().conditional("is_percent_discount", {
      is: true,
      then: Joi.number().min(1).max(100).integer().required(),
      otherwise: Joi.number()
        .min(500)
        .max(unsignedMediumInt)
        .integer()
        .required(),
    }),

    product_id: Joi.number().min(1).integer().required(),
  });

  const result = schema.validate(request);
  return result;
}
