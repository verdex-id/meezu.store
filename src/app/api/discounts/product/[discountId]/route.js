import prisma, { prismaErrorCode } from "@/lib/prisma";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";
import { ErrorWithCode } from "@/utils/custom-error";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const admin = await fetchAdminIfAuthorized();
  if (admin.error) {
    if (admin.errorCode === 500) {
      return NextResponse.json(...errorResponse());
    }
    return NextResponse.json(...failResponse(admin.error, admin.errorCode));
  }

  const schema = Joi.object({
    discount_id: Joi.number().integer().min(0).required(),
  });

  const validationResult = schema.validate({ discount_id: params.discountId });
  if (validationResult.error) {
    return NextResponse.json(
      ...failResponse(
        "Invalid request format.",
        400,
        validationResult.error.details,
      ),
    );
  }

  const discountId = parseInt(params.discountId);
  let deletedDiscount;
  try {
    await prisma.$transaction(async (tx) => {
      const existingDiscount = await tx.discount.findUnique({
        where: {
          discount_id: discountId,
          product_discount: { isNot: null },
        },
        select: {
          product_discount: true,
        },
      });

      if (!existingDiscount) {
        throw new ErrorWithCode("Discount not found", 404);
      }

      if (!existingDiscount.product_discount) {
        throw new ErrorWithCode("Discount not found", 404);
      }

      await tx.productDiscount.delete({
        where: {
          discount_id: discountId,
        },
      });

      deletedDiscount = await tx.discount.delete({
        where: {
          discount_id: discountId,
        },
      });
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(...failResponse(prismaErrorCode[e.code], 409));
    }

    if (e instanceof ErrorWithCode) {
      return NextResponse.json(...failResponse(e.message, e.code));
    }

    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(
    ...successResponse({ deleted_discount: deletedDiscount }),
  );
}
