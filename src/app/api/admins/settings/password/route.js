import { headers } from "next/headers";
import { Prisma } from "@prisma/client";
import { prismaErrorCode } from "@/lib/prisma";
import Joi from "joi";
import { failResponse, successResponse, errorResponse } from "@/utils/response";
import { authPayloadAccountId } from "@/middleware";
import { comparePassword, hashPassword } from "@/lib/password";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request) {
  const payloadAdminId = headers().get(authPayloadAccountId);

  const schema = Joi.object({
    password: Joi.string().required(),
    new_password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9 ]{3,30}$"))
      .min(6)
      .required(),
  });

  const req = await request.json();

  const invalidReq = schema.validate(req);
  if (invalidReq.error) {
    return NextResponse.json(
      ...failResponse("Invalid request format.", 403, invalidReq.error.details),
    );
  }

  let admin = await prisma.admin.findUnique({
    where: {
      admin_id: payloadAdminId,
    },
  });

  if (!admin) {
    return NextResponse.json(...errorResponse());
  }

  const isCorrectPassword = await comparePassword(
    req.password,
    admin.admin_hashedPassword,
  );

  if (!isCorrectPassword) {
    return NextResponse.json(...failResponse("Password incorrect.", 401));
  }

  const newHashedPassword = await hashPassword(req.new_password);
  if (!newHashedPassword) {
    return NextResponse.json(...errorResponse());
  }

  try {
    admin = await prisma.admin.update({
      where: {
        admin_id: admin.admin_id,
      },
      data: {
        admin_hashedPassword: newHashedPassword,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(...failResponse(prismaErrorCode[e.code], 409));
    }
    return NextResponse.json(
      ...errorResponse(
        "Unable to perform action at this time. Please try again later.",
      ),
    );
  }

  return NextResponse.json(
    ...successResponse({ message: "Password successfully updated" }),
  );
}
