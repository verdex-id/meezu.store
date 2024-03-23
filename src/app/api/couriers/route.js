import { errorResponse, failResponse, successResponse } from "@/utils/response";
import prisma from "@/lib/prisma";
import Joi from "joi";
import { NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { headers } from "next/headers";
import { authPayloadAccountId } from "@/middleware";

export async function GET(request) {
  const schema = Joi.object({
    available: Joi.boolean().required(),
  });

  const { searchParams } = new URL(request.url);
  const available = searchParams.get("available");

  const invalidReq = schema.validate({
    available: available,
  });

  if (invalidReq.error) {
    return NextResponse.json(
      ...failResponse("Invalid request format.", 400, invalidReq.error.details),
    );
  }

  let biteshipCouriers = await getCouriers();

  const existingCouriers = await prisma.courier.findMany({
    select: {
      courier_code: true,
      courier_service_code: true,
    },
  });
  const existingCourierCodes = existingCouriers.map(
    (courier) => courier.courier_code,
  );

  const existingCourierServiceCodes = existingCouriers.map(
    (courier) => courier.courier_service_code,
  );

  if (available === "true") {
    biteshipCouriers.couriers = biteshipCouriers.couriers.filter((courier) => {
      if (
        existingCourierCodes.includes(courier.courier_code) &&
        existingCourierServiceCodes.includes(courier.courier_service_code)
      ) {
        return courier;
      }
    });
  } else {
    biteshipCouriers.couriers = biteshipCouriers.couriers.filter((courier) => {
      if (
        !existingCourierCodes.includes(courier.courier_code) &&
        !existingCourierServiceCodes.includes(courier.courier_service_code)
      ) {
        return courier;
      }
    });
  }

  return NextResponse.json(
    ...successResponse({ courier_companies: biteshipCouriers }),
  );
}

export async function POST(request) {
  const payloadAdminId = headers().get(authPayloadAccountId);

  const admin = await prisma.admin.findUnique({
    where: { admin_id: payloadAdminId },
  });

  if (!admin) {
    return NextResponse.json(
      ...failResponse(
        "Unauthorized account: You do not have permission to perform this action.",
        401,
      ),
    );
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
    return NextResponse.json(
      ...failResponse("invalid request format.", 403, invalidReq.error.details),
    );
  }
  const biteshipCouriers = await getCouriers();

  const isSupported = biteshipCouriers.couriers.find(
    (courier) =>
      req.courier_service_code === courier.courier_service_code &&
      req.courier_code === courier.courier_code,
  );

  if (!isSupported) {
    return NextResponse.json(
      ...failResponse(
        "Unable to add this specific company, please add a supported company",
        422,
      ),
    );
  }

  let createdCourierCompany;

  try {
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
      return NextResponse.json(
        ...failResponse("Invalid request", 409, e.message),
      );
    }

    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(
    ...successResponse({ courier_company: createdCourierCompany }),
  );
}

export async function DELETE(request) {
  const payloadAdminId = headers().get(authPayloadAccountId);

  const admin = await prisma.admin.findUnique({
    where: { admin_id: payloadAdminId },
  });

  if (!admin) {
    return NextResponse.json(
      ...failResponse(
        "Unauthorized account: You do not have permission to perform this action.",
        401,
      ),
    );
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
    return NextResponse.json(
      ...failResponse("invalid request format.", 403, invalidReq.error.details),
    );
  }

  let deletedCourierCompany;

  try {
    deletedCourierCompany = await prisma.courier.delete({
      where: {
        courier_code_courier_service_code: {
          courier_code: req.courier_code,
          courier_service_code: req.courier_service_code,
        },
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        ...failResponse("Invalid request", 409, e.message),
      );
    }
    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(
    ...successResponse({ deleted_courier_company: deletedCourierCompany }),
  );
}

async function getCouriers() {
  const options = {
    method: "GET",
    headers: {
      Authorization: process.env.BITESHIP_API_KEY,
    },
  };

  let biteshipCouriers = await fetch(
    "https://api.biteship.com/v1/couriers",
    options,
  )
    .then((response) => response.json())
    .then((response) => response);

  return biteshipCouriers;
}
