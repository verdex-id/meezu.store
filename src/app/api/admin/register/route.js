import { prismaErrorCode } from "@/utils/prisma";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import Joi from "joi";
import { hashPassword } from "@/lib/password";
import prisma from "@/lib/prisma";

export async function POST(request) {
  const schema = Joi.object({
    admin_full_name: Joi.string()
      .pattern(/^[A-Za-z\s']+$/)
      .min(3)
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9 ]{3,30}$"))
      .min(6)
      .required(),
    admin_email: Joi.string().email().required(),
  });

  const req = await request.json();
  const invalidReq = schema.validate(req);
  if (invalidReq.error) {
    return NextResponse.json(
      ...failResponse("Invalid request format.", 403, invalidReq.error.details),
    );
  }

  const hashedPassword = await hashPassword(req.password);
  if (!hashedPassword) {
    return NextResponse.json(...errorResponse());
  }

  let admin;

  try {
    admin = await prisma.Admin.create({
      data: {
        admin_full_name: req.admin_full_name,
        admin_hashedPassword: hashedPassword,
        admin_email: req.admin_email,
      },
      select: {
        id: true,
        admin_email: true,
        admin_full_name: true,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(...failResponse(prismaErrorCode[e.code], 409));
    }
    return NextResponse.json(
      ...errorResponse(
        "Unable to register at this time. Please try again later.",
      ),
    );
  }

  const res = {
    admin_full_name: admin.admin_full_name,
    admin_email: admin.admin_email,
  };

  return NextResponse.json(...successResponse(res));
}
