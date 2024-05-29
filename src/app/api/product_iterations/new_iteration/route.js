import prisma, { prismaErrorCode } from "@/lib/prisma";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";
import { FailError } from "@/utils/custom-error";
import { unsignedMediumInt, unsignedSmallInt } from "@/utils/mysql";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function POST(request) {
  let newIteration;
  try {
    const admin = await fetchAdminIfAuthorized();
    if (admin.error) {
      throw new FailError(admin.error, admin.errorCode);
    }

    const schema = Joi.object({
      product_id: Joi.number().integer().required(),
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
    });

    const { searchParams } = new URL(request.url);
    const productId = parseInt(searchParams.get("product_id"));
    let req = await request.json();

    req = schema.validate({ product_id: productId, ...req });
    if (req.error) {
      throw new FailError("Invalid request format", 403, req.error.details);
    }
    req = req.value;

    newIteration = await prisma.productIteration.create({
      data: {
        product_id: req.product_id,
        product_variant_weight: req.product_variant_weight,
        product_variant_price: req.product_variant_price,
        product_variant_stock: req.product_variant_stock,
      },
      select: {
        product_variant_price: true,
        product_variant_stock: true,
        product_variant_weight: true,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return NextResponse.json(
          ...failResponse(`${e.meta.modelName} not found`, 404),
        );
      }
      return NextResponse.json(
        ...failResponse(prismaErrorCode[e.code], 409, e.meta.modelName),
      );
    }

    if (e instanceof FailError) {
      return NextResponse.json(...failResponse(e.message, e.code, e.detail));
    }

    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(...successResponse({ new_variant: newIteration }));
}
