import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { createToken, verifyToken } from "@/lib/jwt";
import Joi from "joi";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { prismaErrorCode } from "@/lib/prisma";
import prisma from "@/lib/prisma";

export async function POST(request) {
  const schema = Joi.object({
    refresh_token: Joi.string().required(),
  });

  const req = await request.json();

  const invalidReq = schema.validate(req);
  if (invalidReq.error) {
    return NextResponse.json(
      ...failResponse("Invalid request format.", 400, invalidReq.error.details),
    );
  }
  const verificationResult = await verifyToken(req.refresh_token);

  if (!verificationResult.isValid) {
    return NextResponse.json(
      ...failResponse("Refresh token has expired or is invalid", 401),
    );
  }

  let session;

  try {
    session = await prisma.session.findUnique({
      where: {
        session_id: verificationResult.payload.id,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(...failResponse(prismaErrorCode[e.code], 400));
    }

    return NextResponse.json(...errorResponse());
  }

  if (!session) {
    return NextResponse.json(...failResponse("Session not found", 404));
  }

  if (session.is_blocked) {
    return NextResponse.json(...failResponse("blocked session", 401));
  }

  if (session.admin_id !== verificationResult.payload.accountId) {
    return NextResponse.json(...failResponse("incorrect session account", 401));
  }

  if (session.refresh_token !== req.refresh_token) {
    return NextResponse.json(...failResponse("mismatched session token", 401));
  }

  const currentTime = new Date();

  if (currentTime > session.expired_at) {
    return NextResponse.json(...failResponse("expired session", 401));
  }

  const newAccessToken = await createToken(
    verificationResult.payload.accountId,
    process.env.ACCESS_TOKEN_DURATION,
  );

  if (newAccessToken.error) {
    return NextResponse.json(...errorResponse());
  }

  const res = {
    access_token: newAccessToken.token,
    access_token_expire_at: newAccessToken.payload.expiredAt,
  };

  return NextResponse.json(...successResponse(res));
}
