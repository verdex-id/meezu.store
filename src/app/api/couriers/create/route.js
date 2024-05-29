import { errorResponse, failResponse, successResponse } from "@/utils/response";
import prisma, { prismaErrorCode } from "@/lib/prisma";
import Joi from "joi";
import { NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { retrieveCouriers } from "@/services/biteship";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";
import { FailError } from "@/utils/custom-error";

export async function POST(request) {
  let createdCourierCompany;
  try {
    const admin = await fetchAdminIfAuthorized();
    if (admin.error) {
      throw new FailError(admin.error, admin.errorCode);
    }

    const schema = Joi.object({
      courier_code: Joi.string()
        .pattern(/^[a-z0-9\s&\_]+$/)
        .min(2)
        .required(),
      courier_service_code: Joi.string()
        .pattern(/^[a-z0-9\s&\_]+$/)
        .min(2)
        .required(),
    });

    const req = await request.json();
    const invalidReq = schema.validate(req);
    if (invalidReq.error) {
      throw new FailError(
        "invalid request format.",
        403,
        invalidReq.error.details,
      );
    }
    const biteshipCouriers = await retrieveCouriers();

    const isSupported = biteshipCouriers.couriers.find(
      (courier) =>
        req.courier_service_code === courier.courier_service_code &&
        req.courier_code === courier.courier_code,
    );

    if (!isSupported) {
      throw new FailError(
        "Unable to add this specific company, please add a supported company",
        422,
      );
    }

    createdCourierCompany = await prisma.courier.create({
      data: {
        courier_code: isSupported.courier_code,
        courier_name: isSupported.courier_name,
        courier_service_code: isSupported.courier_service_code,
        courier_service_name: isSupported.courier_service_name,
      },
      select: {
        courier_id: true,
        courier_name: true,
        courier_code: true,
        courier_service_name: true,
        courier_service_code: true,
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

  return NextResponse.json(
    ...successResponse({ courier_company: createdCourierCompany }),
  );
}
