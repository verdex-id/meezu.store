import prisma, { prismaErrorCode } from "@/lib/prisma";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { createSlug } from "@/utils/slugify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { JSONPath } from "jsonpath-plus";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const schema = Joi.object({
    product_slug: Joi.string().required(),
  });

  const slug = params.productSlug;

  const validationResult = schema.validate({
    product_slug: slug,
  });

  if (validationResult.error) {
    return NextResponse.json(
      ...failResponse(
        "Invalid request format.",
        400,
        validationResult.error.details,
      ),
    );
  }
  const product = await prisma.product.findUnique({
    where: {
      product_slug: slug,
    },
    select: {
      product_id: true,
      product_slug: true,
      product_name: true,
      product_description: true,
      product_category: {
        select: {
          product_category_name: true,
          product_category_slug: true,
        },
      },
      product_iterations: {
        select: {
          product_iteration_id: true,
          product_variant_price: true,
          product_variant_stock: true,
          product_variant_weight: true,
          product_variant_mapping: {
            select: {
              variant: {
                select: {
                  variant_slug: true,
                  variant_name: true,
                  varian_type: {
                    select: {
                      variant_type_name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json(...failResponse("Product not found", 404));
  }

  return NextResponse.json(...successResponse({ product: product }));
}

export async function PATCH(request, { params }) {
  const admin = await fetchAdminIfAuthorized();
  if (admin.error) {
    if (admin.errorCode === 500) {
      return NextResponse.json(...errorResponse());
    }
    return NextResponse.json(...failResponse(admin.error, admin.errorCode));
  }

  let schema = Joi.object({
    product_slug: Joi.string().required(),
  });

  const slug = params.productSlug;

  let validationResult = schema.validate({
    product_slug: slug,
  });

  if (validationResult.error) {
    return NextResponse.json(
      ...failResponse(
        "Invalid request format.",
        400,
        validationResult.error.details,
      ),
    );
  }

  schema = Joi.object({
    new_product_name: Joi.string().min(3).max(70).required(),
    new_product_description: Joi.string().min(3).max(2000).required(),
  });

  const req = await request.json();

  validationResult = schema.validate(req);
  if (validationResult.error) {
    return NextResponse.json(
      ...failResponse(
        "Invalid request format.",
        403,
        validationResult.error.details,
      ),
    );
  }

  let updatedProduct;

  try {
    updatedProduct = await prisma.product.update({
      where: {
        product_slug: slug,
      },
      data: {
        product_slug: createSlug(req.new_product_name),
        product_name: req.new_product_name,
        product_description: req.new_product_description,
      },
      select: {
        product_slug: true,
        product_name: true,
        product_description: true,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(...failResponse(prismaErrorCode[e.code], 409));
    }

    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(
    ...successResponse({ updated_product: updatedProduct }),
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

  const schema = Joi.object({
    product_slug: Joi.string().required(),
  });

  const slug = params.productSlug;

  const validationResult = schema.validate({
    product_slug: slug,
  });

  if (validationResult.error) {
    return NextResponse.json(
      ...failResponse(
        "Invalid request format.",
        400,
        validationResult.error.details,
      ),
    );
  }

  const targetedProduct = await prisma.product.findUnique({
    where: {
      product_slug: slug,
    },
    select: {
      product_id: true,
      product_iterations: {
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

  if (!targetedProduct) {
    return NextResponse.json(...failResponse("Product not found", 404));
  }

  const productIterationIds = JSONPath({
    path: "$.product_iterations[*].product_iteration_id",
    json: targetedProduct,
  });

  const productVariantMappingIds = JSONPath({
    path: "$.product_iterations[*].product_variant_mapping[*].product_variant_mapping_id",
    json: targetedProduct,
  });

  let deletedProduct;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.productVariantMapping.deleteMany({
        where: {
          product_variant_mapping_id: { in: productVariantMappingIds },
        },
      });

      await tx.productIteration.deleteMany({
        where: {
          product_iteration_id: { in: productIterationIds },
        },
      });

      deletedProduct = await tx.product.delete({
        where: {
          product_slug: slug,
        },
        select: {
          product_id: true,
          product_slug: true,
          product_name: true,
          product_description: true,
        },
      });
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(...failResponse(prismaErrorCode[e.code], 409));
    }

    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(
    ...successResponse({ deleted_product: deletedProduct }),
  );
}
