import prisma from "@/lib/prisma";
import { failResponse, successResponse } from "@/utils/response";
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
    product_category_id: Joi.string(),
    product_category_name: Joi.string().min(3).max(50),
    product_name: Joi.string().min(3).max(70).required(),
    product_description: Joi.string().min(3).max(2000).required(),
    product_iterations: Joi.array().items(productIterationSchema),
  });

  const req = await request.json();

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
          !heap.types[variant.variant_type_name].includes(variant.variant_name)
        ) {
          heap.types[variant.variant_type_name].push(variant.variant_name);
        }
      } else {
        heap.types[variant.variant_type_name] = [variant.variant_name];
      }
    });
  });

  const invalidReq = schema.validate(req);
  if (invalidReq.error) {
    return NextResponse.json(
      ...failResponse("Invalid request format.", 403, invalidReq.error.details),
    );
  }

  await prisma.variantType.createMany({
    data: Object.keys(heap.types).map((key) => {
      return { variant_type_name: key };
    }),
    skipDuplicates: true,
  });

  const existTypes = await prisma.variantType.findMany({
    where: {
      variant_type_name: { in: Object.keys(heap.types) },
    },
    select: {
      id: true,
      variant_type_name: true,
    },
  });

  const variants = [];
  Object.keys(heap.types).forEach((key) => {
    heap.types[key].forEach((variant) => {
      variants.push({
        variant_slug: variant,
        variant_name: variant,
        varian_type_id: existTypes.find(
          (type) => type.variant_type_name === key,
        ).id,
      });
    });
  });

  await prisma.variant.createMany({
    data: variants,
    skipDuplicates: true,
  });

  const createdProductCategory = await prisma.productCategory.upsert({
    where: { product_category_slug: req.product_category_name },
    update: {},
    create: {
      product_category_slug: req.product_category_name,
      product_category_name: req.product_category_name,
    },
    select: { id: true },
  });

  const productIterations = req.product_iterations.map((productIteration) => ({
    product_variant_weight: parseInt(productIteration.product_variant_weight),
    product_variant_price: parseInt(productIteration.product_variant_price),
    product_variant_stock: parseInt(productIteration.product_variant_stock),
  }));

  const existProduct = await prisma.product.findUnique({
    where: {
      product_slug: req.product_name,
    },
  });

  if (existProduct) {
    return;
  }

  const createdProduct = await prisma.product.create({
    data: {
      product_slug: req.product_name,
      product_name: req.product_name,
      product_description: req.product_description,
      product_category_id: createdProductCategory.id,

      product_iterations: {
        createMany: {
          data: productIterations,
          skipDuplicates: true,
        },
      },
    },
    select: {
      id: true,
      product_iterations: {
        select: {
          id: true,
        },
      },
    },
  });

  heap["variants"] = [];
  createdProduct.product_iterations.forEach((itr, i) => {
    heap.mappings[i].product_iteration_id = itr.id;

    heap.mappings[i].associated_variant.forEach((variant) => {
      if (!heap.variants.includes(variant)) {
        heap.variants.push(variant);
      }
    });
  });

  const createdVariants = await prisma.variant.findMany({
    where: {
      variant_slug: { in: heap.variants },
    },
    select: {
      id: true,
      variant_slug: true,
    },
  });

  heap.variants = createdVariants;

  const productVariantMappings = [];
  heap.mappings.forEach((mapping) => {
    mapping.associated_variant.forEach((mapVar) => {
      productVariantMappings.push({
        product_iteration_id: mapping.product_iteration_id,
        variant_id: heap.variants.find(
          (variant) => variant.variant_slug === mapVar,
        ).id,
      });
    });
  });

  await prisma.productVariantMapping.createMany({
    data: productVariantMappings,
    skipDuplicates: true,
  });

  const finalProduct = await prisma.product.findUnique({
    where: {
      id: createdProduct.id,
    },
    select: {
      id: true,
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

  return NextResponse.json(...successResponse({ product: finalProduct }));
}

export async function GET() {
  const products = await prisma.product.findMany({
    select: {
      product_slug: true,
      product_name: true,
      product_iterations: {
        orderBy: { product_variant_price: "asc" },
        take: 1,
        select: {
          product_variant_price: true,
          id: true,
        },
      },
    },
  });

  return NextResponse.json(...successResponse({ products: products }));
}
