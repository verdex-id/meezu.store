import prisma, { prismaErrorCode } from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const schema = Joi.object({
    ids: Joi.array().items(Joi.number()),
  });
  let req = schema.validate(await request.json());
  if (req.error) {
    throw new FailError("Invalid request format", 403, req.error.details);
  }
  req = req.value;

  let products;
  try {
    products = await prisma.productIteration.findMany({
      where: {
        product_iteration_id: {
          in: req.ids,
        },
      },
      include: {
        product: true,
        iteration_images: true,
        product_variant_mapping: {
          include: {
            variant: {
              include: {
                varian_type: true,
              },
            },
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
