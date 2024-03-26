import prisma, { prismaErrorCode } from "@/lib/prisma";
import { ErrorWithCode } from "@/utils/custom-error";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { createSlug } from "@/utils/slugify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi, { ref } from "joi";
import { JSONPath } from "jsonpath-plus";
import { NextResponse } from "next/server";

export async function GET(request) {
  const schema = Joi.object({
    page: Joi.number().min(1).integer().required(),
    limit: Joi.number().min(1).max(30).integer().required(),
  });

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  const invalidReq = schema.validate({
    page,
    limit,
  });

  if (invalidReq.error) {
    return NextResponse.json(
      ...failResponse("Invalid request format.", 400, invalidReq.error.details),
    );
  }

  const products = await prisma.product.findMany({
    skip: parseInt(limit) * (parseInt(page) - 1),
    take: parseInt(limit),
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
  });

  return NextResponse.json(...successResponse({ products }));
}

export async function POST(request) {
  const productIterationSchema = Joi.object({
    product_variant_weight: Joi.number().max(500_000).integer().required(),
    product_variant_price: Joi.number()
      .min(500)
      .max(16_500_000)
      .integer()
      .required(),
    product_variant_stock: Joi.number().min(0).max(65_000).integer().required(),
    variants: Joi.array().items(
      Joi.object({
        variant_type_name: Joi.string().min(3).max(30),
        variant_name: Joi.string().min(3).max(15),
      }),
    ),
  });

  const schema = Joi.object({
    product_category_name: Joi.string().min(3).max(50).required(),
    product_name: Joi.string().min(3).max(70).required(),
    product_description: Joi.string().min(3).max(2000).required(),
    product_iterations: Joi.array().items(productIterationSchema),
  });

  const req = await request.json();

  const invalidReq = schema.validate(req);
  if (invalidReq.error) {
    return NextResponse.json(
      ...failResponse("Invalid request format.", 403, invalidReq.error.details),
    );
  }

  let finalProduct;

  try {
    await prisma.$transaction(async (tx) => {
      const existProduct = await tx.product.findUnique({
        where: {
          product_slug: createSlug(req.product_name),
        },
      });

      if (existProduct) {
        throw new ErrorWithCode(
          "Product creation failed: Duplicate product.",
          409,
        );
      }

      const variantTypeNames = JSONPath({
        path: "$.product_iterations[*].variants[*].variant_type_name",
        json: req,
      });

      await tx.variantType.createMany({
        data: variantTypeNames.map((name) => ({ variant_type_name: name })),
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
        where: { product_category_slug: createSlug(req.product_category_name) },
        update: {},
        create: {
          product_category_slug: createSlug(req.product_category_name),
          product_category_name: req.product_category_name,
        },
        select: { product_category_id: true },
      });

      const productIterations = req.product_iterations.map(
        (productIteration) => ({
          product_variant_weight: parseInt(
            productIteration.product_variant_weight,
          ),
          product_variant_price: parseInt(
            productIteration.product_variant_price,
          ),
          product_variant_stock: parseInt(
            productIteration.product_variant_stock,
          ),
        }),
      );

      const createdProduct = await tx.product.create({
        data: {
          product_slug: createSlug(req.product_name),
          product_name: req.product_name,
          product_description: req.product_description,
          product_category_id: createdProductCategory.product_category_id,

          product_iterations: {
            createMany: {
              data: productIterations,
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

      const requestVariants = JSONPath({
        path: "$.product_iterations[*].variants[*].variant_name",
        json: req,
      }).reduce((result, val) => {
        const slugify = createSlug(val);
        if (!result.includes(slugify)) {
          result.push(slugify);
        }
        return result;
      }, []);

      const createdVariants = await tx.variant.findMany({
        where: {
          variant_slug: { in: requestVariants },
        },
        select: {
          variant_id: true,
          variant_slug: true,
        },
      });

      const productVariantMappings = [];
      createdProduct.product_iterations.forEach((itr, i) => {
        const relatedVariants = JSONPath({
          path: `$.product_iterations[${i}].variants[*].variant_name`,
          json: req,
        });
        relatedVariants.forEach((variant) => {
          productVariantMappings.push({
            product_iteration_id: itr.product_iteration_id,
            variant_id: createdVariants.find(
              (createdVariant) =>
                createdVariant.variant_slug === createSlug(variant),
            ).variant_id,
          });
        });
      });

      await tx.productVariantMapping.createMany({
        data: productVariantMappings,
        skipDuplicates: true,
      });

      finalProduct = await tx.product.findUnique({
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

  return NextResponse.json(...successResponse({ product: finalProduct }));
}
