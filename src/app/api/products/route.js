import prisma, { prismaErrorCode } from "@/lib/prisma";
import { ErrorWithCode } from "@/utils/custom-error";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { createSlug } from "@/utils/slugify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";

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
      const heap = {
        types: {},
        mappings: [],
      };

      req.product_iterations.forEach((productIteration, i) => {
        heap.mappings.push({
          product_iteration_id: "",
          associated_variant: [],
        });

        productIteration.variants.forEach((variant) => {
          heap.mappings[i].associated_variant.push(variant.variant_name);

          if (variant.variant_type_name in heap.types) {
            if (
              !heap.types[variant.variant_type_name].includes(
                variant.variant_name,
              )
            ) {
              heap.types[variant.variant_type_name].push(variant.variant_name);
            }
          } else {
            heap.types[variant.variant_type_name] = [variant.variant_name];
          }
        });
      });

      await tx.variantType.createMany({
        data: Object.keys(heap.types).map((key) => {
          return { variant_type_name: key };
        }),
        skipDuplicates: true,
      });

      const existTypes = await tx.variantType.findMany({
        where: {
          variant_type_name: { in: Object.keys(heap.types) },
        },
        select: {
          varian_type_id: true,
          variant_type_name: true,
        },
      });

      const variants = [];
      Object.keys(heap.types).forEach((key) => {
        const type_id = existTypes.find(
          (type) => type.variant_type_name === key,
        ).varian_type_id;

        heap.types[key].forEach((variant) => {
          variants.push({
            variant_slug: createSlug(variant),
            variant_name: variant,
            varian_type_id: type_id,
          });
        });
      });

      await tx.variant.createMany({
        data: variants,
        skipDuplicates: true,
      });

      const existProduct = await tx.product.findUnique({
        where: {
          product_slug: createSlug(req.product_name),
        },
      });

      if (existProduct) {
        throw new ErrorWithCode(
          "Product creation failed: Duplicate product detected.",
          409,
        );
      }

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

      heap["variants"] = [];
      createdProduct.product_iterations.forEach((itr, i) => {
        heap.mappings[i].product_iteration_id = itr.product_iteration_id;

        heap.mappings[i].associated_variant.forEach((variant) => {
          if (!heap.variants.includes(createSlug(variant))) {
            heap.variants.push(createSlug(variant));
          }
        });
      });

      const createdVariants = await tx.variant.findMany({
        where: {
          variant_slug: { in: heap.variants },
        },
        select: {
          variant_id: true,
          variant_slug: true,
        },
      });

      heap.variants = createdVariants;

      const productVariantMappings = [];
      heap.mappings.forEach((mapping) => {
        mapping.associated_variant.forEach((mapVar) => {
          const variantSlug = createSlug(mapVar);
          productVariantMappings.push({
            product_iteration_id: mapping.product_iteration_id,
            variant_id: heap.variants.find(
              (variant) => variant.variant_slug === variantSlug,
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
