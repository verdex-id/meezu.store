import prisma, { prismaErrorCode } from "@/lib/prisma";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";
import { FailError } from "@/utils/custom-error";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { createSlug } from "@/utils/slugify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { JSONPath } from "jsonpath-plus";
import { NextResponse } from "next/server";
import { makeRequestValidation } from "./make-validation";
import { prepareData } from "./prepare-data";

export async function GET(request) {
  const schema = Joi.object({
    page: Joi.number().min(1).integer().required(),
    limit: Joi.number().min(1).max(30).integer().required(),
  });

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  const validationResult = schema.validate({
    page,
    limit,
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

  let products;
  try {
    products = await prisma.product.findMany({
      skip: parseInt(limit) * (parseInt(page) - 1),
      take: parseInt(limit),
      select: {
        product_id: true,
        product_slug: true,
        product_name: true,
        product_discounts: {
          select: {
            discount: {
              select: {
                discount_value: true,
                is_percent_discount: true,
              },
            },
          },
        },
        product_iterations: {
          orderBy: { product_variant_price: "asc" },
          take: 1,
          select: {
            product_iteration_id: true,
            product_variant_price: true,
          },
        },
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(...failResponse(prismaErrorCode[e.code], 409));
    }

    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(...successResponse({ products }));
}

export async function POST(request) {
  let finalProduct;
  try {
    const admin = await fetchAdminIfAuthorized();
    if (admin.error) {
      throw new FailError(admin.error, admin.errorCode);
    }

    let req = makeRequestValidation(await request.json());
    if (req.error) {
      throw req.error;
    }
    req = req.request;

    const datas = prepareData(req);

    let {
      productCategorySlug,
      variantTypeNames,
      variantSlugs,
      iterationsVariants,
      variantTypeCreateManyArg,
      productIterationsCreateManyArg,
    } = datas;

    let createdProduct;
    await prisma.$transaction(async (tx) => {
      await tx.variantType.createMany({
        data: variantTypeCreateManyArg,
        skipDuplicates: true,
      });

      const existTypes = await tx.variantType.findMany({
        where: {
          variant_type_name: { in: variantTypeNames },
        },
        select: {
          varian_type_id: true,
          variant_type_name: true,
        },
      });

      const variants = [];
      existTypes.forEach((type) => {
        const relatedVariants = JSONPath({
          path: `$.product_iterations[*].variants[?(@.variant_type_name=="${type.variant_type_name}")].variant_name`,
          json: req,
        });

        relatedVariants.forEach((variant) =>
          variants.push({
            variant_slug: createSlug(variant),
            variant_name: variant,
            varian_type_id: type.varian_type_id,
          }),
        );
      });

      await tx.variant.createMany({
        data: variants,
        skipDuplicates: true,
      });

      const createdProductCategory = await tx.productCategory.upsert({
        where: { product_category_slug: productCategorySlug },
        update: {},
        create: {
          product_category_slug: productCategorySlug,
          product_category_name: req.product_category_name,
        },
        select: { product_category_id: true },
      });

      createdProduct = await tx.product.create({
        data: {
          product_slug: createSlug(req.product_name),
          product_name: req.product_name,
          product_description: req.product_description,
          product_category_id: createdProductCategory.product_category_id,

          product_iterations: {
            createMany: {
              data: productIterationsCreateManyArg,
              skipDuplicates: true,
            },
          },
        },
        select: {
          product_id: true,
          product_iterations: {
            select: {
              product_iteration_id: true,
            },
          },
        },
      });

      const createdVariants = await tx.variant.findMany({
        where: {
          variant_slug: { in: variantSlugs },
        },
        select: {
          variant_id: true,
          variant_slug: true,
        },
      });

      const productVariantMappings = [];
      createdProduct.product_iterations.forEach((itr, i) => {
        iterationsVariants[i].forEach((variant) => {
          productVariantMappings.push({
            product_iteration_id: itr.product_iteration_id,
            variant_id: createdVariants.find(
              (createdVariant) => createdVariant.variant_slug === variant,
            ).variant_id,
          });
        });
      });

      await tx.productVariantMapping.createMany({
        data: productVariantMappings,
        skipDuplicates: true,
      });
    });

    finalProduct = await prisma.product.findUnique({
      where: {
        product_id: createdProduct.product_id,
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

  return NextResponse.json(...successResponse({ product: finalProduct }));
}
