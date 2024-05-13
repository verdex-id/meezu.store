import prisma, { prismaErrorCode } from "@/lib/prisma";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";
import { FailError } from "@/utils/custom-error";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { createSlug } from "@/utils/slugify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import Joi from "joi";
import { unsignedMediumInt, unsignedSmallInt } from "@/utils/mysql";

export async function GET(request) {
  let products;
  try {
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
      throw new FailError(
        "Invalid request format.",
        400,
        validationResult.error.details,
      );
    }

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
            iteration_images:true,
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

  return NextResponse.json(...successResponse({ products }));
}

export async function POST(request) {
  let createdProduct;
  try {
    const admin = await fetchAdminIfAuthorized();
    if (admin.error) {
      throw new FailError(admin.error, admin.errorCode);
    }

    const schema = Joi.object({
      product_category_name: Joi.string().min(3).max(50).required(),
      product_name: Joi.string()
        .pattern(/^[a-zA-Z0-9\s_()&/\[\].,=-]+$/)
        .min(3)
        .max(70)
        .required(),
      product_description: Joi.string().min(3).max(2000).required(),
      product_iteration: Joi.object({
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
      }),
    });

    let req = schema.validate(await request.json());
    if (req.error) {
      throw new FailError("Invalid request format", 403, req.error.details);
    }
    req = req.value;

    const productCategorySlug = createSlug(req.product_category_name);

    await prisma.$transaction(async (tx) => {
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
            create: {
              product_variant_weight:
                req.product_iteration.product_variant_weight,
              product_variant_price:
                req.product_iteration.product_variant_price,
              product_variant_stock:
                req.product_iteration.product_variant_stock,
            },
          },
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
            },
          },
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
    ...successResponse({ created_product: createdProduct }),
  );
}
