import prisma, { prismaErrorCode } from "@/lib/prisma";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";
import { FailError } from "@/utils/custom-error";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { NextResponse } from "next/server";
import fs from "fs";

export async function GET(req, { params }) {
  let banners;
  try {
    const schema = Joi.object({
      banner_id: Joi.number().integer().required(),
    });
    let req = schema.validate({
      banner_id: params.bannerId,
    });
    if (req.error) {
      throw new FailError("Invalid request format", 403, req.error.details);
    }
    req = req.value;

    banners = await prisma.banner.findUnique({
      where: {
        banner_id: req.banner_id,
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
    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(...successResponse({ banners: banners }));
}

export async function PATCH(request, { params }) {
  let banner;
  try {
    const admin = await fetchAdminIfAuthorized();
    if (admin.error) {
      throw new FailError(admin.error, admin.errorCode);
    }

    const schema = Joi.object({
      banner_id: Joi.number().integer().required(),
      banner_url: Joi.string().uri().required(),
    });
    let req = await request.json();
    req = schema.validate({
      banner_id: params.bannerId,
      ...req,
    });
    if (req.error) {
      throw new FailError("Invalid request format", 403, req.error.details);
    }
    req = req.value;

    banner = await prisma.banner.update({
      where: {
        banner_id: req.banner_id,
      },
      data: {
        banner_url: req.banner_url,
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

  return NextResponse.json(...successResponse({ updated_banner: banner }));
}

export async function DELETE(request, { params }) {
  let banner;
  try {
    const admin = await fetchAdminIfAuthorized();
    if (admin.error) {
      throw new FailError(admin.error, admin.errorCode);
    }

    const schema = Joi.object({
      banner_id: Joi.number().integer().required(),
    });
    let req = schema.validate({
      banner_id: params.bannerId,
    });
    if (req.error) {
      throw new FailError("Invalid request format", 403, req.error.details);
    }
    req = req.value;

    banner = await prisma.banner.delete({
      where: {
        banner_id: req.banner_id,
      },
    });

    fs.unlinkSync(banner.banner_image_path);
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
      deleted_banner: {
        banner_id: banner.banner_id,
        banner_url: banner.banner_url,
      },
    }),
  );
}
