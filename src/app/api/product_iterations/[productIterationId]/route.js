import prisma, { prismaErrorCode } from "@/lib/prisma";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";
import { FailError } from "@/utils/custom-error";
import { unsignedMediumInt, unsignedSmallInt } from "@/utils/mysql";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  let updatedProductIteration;
  try {
    const admin = await fetchAdminIfAuthorized();
    if (admin.error) {
      throw new FailError(admin.error, admin.errorCode);
    }

    const schema = Joi.object({
      product_iteration_id: Joi.number().integer().required(),
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
    req = schema.validate({
      product_iteration_id: params.productIterationId,
      ...req,
    });
    if (req.error) {
      throw new FailError("Invalid request format", 403, req.error.details);
    }
    req = req.value;

    updatedProductIteration = await prisma.productIteration.update({
      where: {
        product_iteration_id: req.product_iteration_id,
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

    const schema = Joi.object({
      product_iteration_id: Joi.number().integer().required(),
    });
    let req = schema.validate({
      product_iteration_id: params.productIterationId,
    });
    if (req.error) {
      throw new FailError("Invalid request format", 403, req.error.details);
    }
    req = req.value;

    const existingProductIteration = await prisma.productIteration.findUnique({
      where: {
        product_iteration_id: req.product_iteration_id,
      },
      select: {
        product_iteration_id: true,
        product: {
          select: {
            product_iterations: {
              take: 200,
            },
          },
        },
        product_variant_mapping: {
          select: {
            product_variant_mapping_id: true,
          },
        },
      },
    });

    if (existingProductIteration.product.product_iterations.length < 2) {
      throw new FailError(
        "fails to remove variants, requiring at least one iteration",
        400,
      );
    }

    if (!existingProductIteration) {
      throw new FailError("Product iteration not found", 404);
    }
    const relatedVariantMappingIds =
      existingProductIteration.product_variant_mapping.reduce(
        (list, varMap) => {
          list.push(varMap.product_variant_mapping_id);
          return list;
        },
        [],
      );

    await prisma.$transaction(async (tx) => {
      await tx.productVariantMapping.deleteMany({
        where: {
          product_variant_mapping_id: { in: relatedVariantMappingIds },
        },
      });

      deletedProductVariant = await tx.productIteration.delete({
        where: {
          product_iteration_id: existingProductIteration.product_iteration_id,
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
