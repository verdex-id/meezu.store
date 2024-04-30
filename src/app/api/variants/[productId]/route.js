import prisma, { prismaErrorCode } from "@/lib/prisma";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";
import { FailError } from "@/utils/custom-error";
import { unsignedMediumInt, unsignedSmallInt } from "@/utils/mysql";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";
import { prepareData } from "./prepare-data";
import { JSONPath } from "jsonpath-plus";
import { createSlug } from "@/utils/slugify";

export async function POST(request, { params }) {
  let newIteration;
  try {
    const admin = await fetchAdminIfAuthorized();
    if (admin.error) {
      throw new FailError(admin.error, admin.errorCode);
    }

    const schema = Joi.object({
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
      variants: Joi.array().items(
        Joi.object({
          variant_type_name: Joi.string()
            .min(3)
            .max(30)
            .pattern(/^[a-zA-Z0-9\s_()&/\[\].,=-]+$/)
            .required(),
          variant_name: Joi.string()
            .min(3)
            .max(15)
            .pattern(/^[a-zA-Z0-9\s]+$/)
            .required(),
        }),
      ),
    });
    let req = schema.validate(await request.json());
    if (req.error) {
      throw new FailError("Invalid request format", 403, req.error.details);
    }
    req = req.value;
    const productId = params.productId;

    const datas = prepareData(req);
    let { variantTypeNames, variantSlugs, variantTypeCreateManyArg } = datas;

    let productIteration;
    await prisma.$transaction(async (tx) => {
      productIteration = await tx.productIteration.create({
        data: {
          product_id: parseInt(productId),
          product_variant_weight: req.product_variant_weight,
          product_variant_price: req.product_variant_price,
          product_variant_stock: req.product_variant_stock,
        },
        select: {
          product_iteration_id: true,
        },
      });

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

      const variantCreateManyArgs = [];
      existTypes.forEach((type) => {
        const relatedVariants = JSONPath({
          path: `$.variants[?(@.variant_type_name=="${type.variant_type_name}")].variant_name`,
          json: req,
        });

        relatedVariants.forEach((variant) =>
          variantCreateManyArgs.push({
            variant_slug: createSlug(variant),
            variant_name: variant,
            varian_type_id: type.varian_type_id,
          }),
        );
      });

      await tx.variant.createMany({
        data: variantCreateManyArgs,
        skipDuplicates: true,
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

      const productVariantMappings = createdVariants.map((variant) => {
        return {
          product_iteration_id: productIteration.product_iteration_id,
          variant_id: variant.variant_id,
        };
      });

      await tx.productVariantMapping.createMany({
        data: productVariantMappings,
        skipDuplicates: true,
      });
    });

    newIteration = await prisma.productIteration.findUnique({
      where: {
        product_iteration_id: productIteration.product_iteration_id,
      },
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
