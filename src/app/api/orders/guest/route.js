import prisma, { prismaErrorCode } from "@/lib/prisma";
import { ErrorWithCode } from "@/utils/custom-error";
import { awaitingPayment } from "@/utils/order-status";
import { errorResponse, failResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function POST() {
  const schema = Joi.object({
    guest_full_name: Joi.string(),
    guest_phone_number: Joi.string(),
    guest_email: Joi.string(),
    guest_address: Joi.string(),
    courier_code: Joi.string(),
    payment_method: Joi.string(),
    discount_code: Joi.string(),
    order_items: Joi.array().items(
      Joi.object({
        product_id: Joi.string(),
        product_iteration_id: Joi.string(),
        quantity: Joi.number().integer(),
      }),
    ),
  });

  const req = await request.json();

  const validationResult = schema.validate(req);
  if (validationResult.error) {
    return NextResponse.json(
      ...failResponse(
        "Invalid request format.",
        403,
        validationResult.error.details,
      ),
    );
  }

  try {
    if (req.discount_code) {
      const discountUsed = await prisma.discount.update({
        where: {
          discount_code: req.discount_code,
        },
        data: {
          number_of_uses: {
            increment: 1,
          },
        },
        select: {
          discount_value: true,
          is_percent_discount: true,
          maximum_discount_amount: true,
          is_limited: true,
          usage_limits: true,
          number_of_uses: true,
          threshold_discount: true,
          limited_time_discount: true,
          daily_discount: true,
        },
      });

      console.log(discountUsed);
    }
  } catch (e) {
    console.log(e);
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(...failResponse(prismaErrorCode[e.code], 409));
    }

    if (e instanceof ErrorWithCode) {
      return NextResponse.json(...failResponse(e.message, e.code));
    }

    return NextResponse.json(...errorResponse());
  }
}
