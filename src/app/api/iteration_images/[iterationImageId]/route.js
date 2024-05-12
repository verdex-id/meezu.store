import { NextResponse } from "next/server";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { FailError } from "@/utils/custom-error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma, { prismaErrorCode } from "@/lib/prisma";
import Joi from "joi";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";

export async function GET(req, { params }) {
  let iterationImage;
  try {
    const schema = Joi.object({
      iteration_image_id: Joi.number().integer().required(),
    });

    let req = schema.validate({ iteration_image_id: params.iterationImageId });
    if (req.error) {
      throw new FailError("Invalid request format", 403, req.error.details);
    }
    req = req.value;

    iterationImage = await prisma.iterationImage.findUnique({
      where: {
        iteration_image_id: req.iteration_image_id,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return NextResponse.json(
          ...failResponse(`${e.meta.modelName} not found`, 404)
        );
      }
      return NextResponse.json(
        ...failResponse(prismaErrorCode[e.code], 409, e.meta.modelName)
      );
    }
    if (e instanceof FailError) {
      return NextResponse.json(...failResponse(e.message, e.code, e.detail));
    }
    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(
    ...successResponse({ iteration_image: iterationImage })
  );
}

export async function DELETE(req, { params }) {
  let iterationImage;
  try {
    const admin = await fetchAdminIfAuthorized();
    if (admin.error) {
      throw new FailError(admin.error, admin.errorCode);
    }

    const schema = Joi.object({
      iteration_image_id: Joi.number().integer().required(),
    });

    let req = schema.validate({ iteration_image_id: params.iterationImageId });
    if (req.error) {
      throw new FailError("Invalid request format", 403, req.error.details);
    }
    req = req.value;

    iterationImage = await prisma.iterationImage.delete({
      where: {
        iteration_image_id: req.iteration_image_id,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return NextResponse.json(
          ...failResponse(`${e.meta.modelName} not found`, 404)
        );
      }
      return NextResponse.json(
        ...failResponse(prismaErrorCode[e.code], 409, e.meta.modelName)
      );
    }
    if (e instanceof FailError) {
      return NextResponse.json(...failResponse(e.message, e.code, e.detail));
    }
    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(
    ...successResponse({ deleted_iteration_image: iterationImage })
  );
}
