import prisma, { prismaErrorCode } from "@/lib/prisma";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";
import { FailError } from "@/utils/custom-error";
import { unsignedMediumInt, unsignedSmallInt } from "@/utils/mysql";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { JSONPath } from "jsonpath-plus";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  let updatedProductIteration;
  try {
    const admin = await fetchAdminIfAuthorized();
    if (admin.error) {
      throw new FailError(admin.error, admin.errorCode);
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
    let req = await request.json();
    req = schema.validate(req);
    if (req.error) {
      throw new FailError("Invalid request format.", 403, req.error.details);
    }
    req = req.value;

    const existingProduct = await prisma.product.findUnique({
      where: {
        product_id: parseInt(params.productId),
      },
      select: {
        product_id: true,
      },
    });

    if (!existingProduct) {
      throw new FailError("Product not found", 404);
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

  return NextResponse.json(
    ...successResponse({ updated_product_iteration: updatedProductIteration }),
  );
}

export async function DELETE(req, { params }) {
  let deletedProductVariant;
  try {
    const admin = await fetchAdminIfAuthorized();
    if (admin.error) {
      throw new FailError(admin.error, admin.errorCode);
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        product_id: parseInt(params.productId),
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
      throw new FailError("Product not found", 404);
    }

    if (existingProduct.product_iterations.length < 1) {
      throw new FailError("Variant not found", 404);
    }

    const relatedVariantMappingIds = JSONPath({
      path: `$.product_iterations[*].product_variant_mapping[*].product_variant_mapping_id`,
      json: existingProduct,
    });
    await prisma.$transaction(async (tx) => {
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

  return NextResponse.json(
    ...successResponse({ deleted_product_variant: deletedProductVariant }),
  );
}
