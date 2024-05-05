import prisma, { prismaErrorCode } from "@/lib/prisma";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";
import { FailError } from "@/utils/custom-error";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { createSlug } from "@/utils/slugify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function GET(request) {
  // const schema = Joi.object({
  //   type: Joi.string()
  //     .pattern(/^[a-z_]+$/)
  //     .required(),
  // });

  const { searchParams } = new URL(request.url);
  const variantType = searchParams.get("variant_type");
  const variantTypeId = searchParams.get("variant_type_id");

  const response = {};
  if (variantType || variantTypeId) {
    response["variant_names"] = await prisma.variant.findMany({
      where: {
        OR: [
          {
            varian_type: {
              variant_type_name: variantType ? variantType : "",
            },
          },
          {
            varian_type_id: variantTypeId ? parseInt(variantTypeId) : 0,
          },
        ],
      },
    });
  } else {
    response["variant_types"] = await prisma.variantType.findMany();
  }

  return NextResponse.json(...successResponse(response));
}

export async function POST(request) {
  let newProductVariantMapping;
  try {
    const admin = await fetchAdminIfAuthorized();
    if (admin.error) {
      throw new FailError(admin.error, admin.errorCode);
    }

    const schema = Joi.object({
      product_iteration_id: Joi.number().integer().required(),
      variant_type_name: Joi.string()
        .min(3)
        .max(30)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .required(),
      variant_name: Joi.string()
        .min(3)
        .max(15)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .required(),
    });

    const { searchParams } = new URL(request.url);
    const productIterationId = parseInt(
      searchParams.get("product_iteration_id"),
    );
    let req = await request.json();

    req = schema.validate({ product_iteration_id: productIterationId, ...req });
    if (req.error) {
      throw new FailError("Invalid request format", 403, req.error.details);
    }
    req = req.value;

    const variantSlug = createSlug(req.variant_name);

    await prisma.$transaction(async (tx) => {
      const createdVariantType = await tx.variantType.upsert({
        where: {
          variant_type_name: req.variant_type_name,
        },
        update: {},
        create: {
          variant_type_name: req.variant_type_name,
        },
        select: {
          varian_type_id: true,
        },
      });

      const createdVariant = await tx.variant.upsert({
        where: {
          variant_slug: variantSlug,
          variant_name: req.variant_name,
          varian_type_id: createdVariantType.varian_type_id,
        },
        update: {},
        create: {
          varian_type_id: createdVariantType.varian_type_id,
          variant_slug: variantSlug,
          variant_name: req.variant_name,
        },
      });

      newProductVariantMapping = await tx.productVariantMapping.create({
        data: {
          product_iteration_id: req.product_iteration_id,
          variant_id: createdVariant.variant_id,
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
    ...successResponse({
      new_product_variant_mapping: newProductVariantMapping,
    }),
  );
}
