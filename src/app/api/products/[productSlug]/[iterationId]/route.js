import prisma, { prismaErrorCode } from "@/lib/prisma";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";
import { ErrorWithCode } from "@/utils/custom-error";
import { unsignedMediumInt, unsignedSmallInt } from "@/utils/mysql";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { JSONPath } from "jsonpath-plus";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  const admin = await fetchAdminIfAuthorized();
  if (admin.error) {
    if (admin.errorCode === 500) {
      return NextResponse.json(...errorResponse());
    }
    return NextResponse.json(...failResponse(admin.error, admin.errorCode));
  }

  const schema = Joi.object({
    new_iteration_price: Joi.number()
      .min(500)
      .max(unsignedMediumInt)
      .integer()
      .required(),
    new_iteration_stock: Joi.number()
      .min(0)
      .max(unsignedSmallInt)
      .integer()
      .required(),
    new_iteration_weight: Joi.number().max(500_000).integer().required(),
  });

  const req = await request.json();

  const invalidReq = schema.validate(req);
  if (invalidReq.error) {
    return NextResponse.json(
      ...failResponse("Invalid request format.", 403, invalidReq.error.details),
    );
  }

  let updatedProductIteration;
  try {
    const existingProduct = await prisma.product.findUnique({
      where: {
        product_slug: params.productSlug,
      },
      select: {
        product_id: true,
      },
    });

    if (!existingProduct) {
      throw new ErrorWithCode("Product not found", 404);
    }

    updatedProductIteration = await prisma.productIteration.update({
      where: {
        product_id: existingProduct.product_id,
        product_iteration_id: parseInt(params.iterationId),
      },
      data: {
        product_variant_price: parseInt(req.new_iteration_price),
        product_variant_stock: parseInt(req.new_iteration_stock),
        product_variant_weight: parseInt(req.new_iteration_weight),
      },
      select: {
        product_iteration_id: true,
        product_variant_price: true,
        product_variant_stock: true,
        product_variant_weight: true,
        product: {
          select: {
            product_id: true,
            product_slug: true,
            product_name: true,
          },
        },
      },
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
    ...successResponse({ updated_product_iteration: updatedProductIteration }),
  );
}

export async function DELETE(req, { params }) {
  const admin = await fetchAdminIfAuthorized();
  if (admin.error) {
    if (admin.errorCode === 500) {
      return NextResponse.json(...errorResponse());
    }
    return NextResponse.json(...failResponse(admin.error, admin.errorCode));
  }

  let deletedProductVariant;
  try {
    await prisma.$transaction(async (tx) => {
      const existingProduct = await prisma.product.findUnique({
        where: {
          product_slug: params.productSlug,
        },
        select: {
          product_id: true,
          product_iterations: {
            where: {
              product_iteration_id: parseInt(params.iterationId),
            },
            take: 1,
            select: {
              product_iteration_id: true,
              product_variant_mapping: {
                select: {
                  product_variant_mapping_id: true,
                },
              },
            },
          },
        },
      });

      if (!existingProduct) {
        throw new ErrorWithCode("Product not found", 404);
      }

      if (existingProduct.product_iterations.length < 1) {
        throw new ErrorWithCode("Variant not found", 404);
      }

      const relatedVariantMappingIds = JSONPath({
        path: `$.product_iterations[*].product_variant_mapping[*].product_variant_mapping_id`,
        json: existingProduct,
      });

      await tx.productVariantMapping.deleteMany({
        where: {
          product_variant_mapping_id: { in: relatedVariantMappingIds },
        },
      });

      deletedProductVariant = await tx.productIteration.delete({
        where: {
          product_iteration_id:
            existingProduct.product_iterations[0].product_iteration_id,
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
    ...successResponse({ deleted_product_variant: deletedProductVariant }),
  );
}
