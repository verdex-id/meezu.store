import { createToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import Joi from "joi";
import { comparePassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request) {
  const schema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
  });

  const req = await request.json();

  const invalidReq = schema.validate(req);
  if (invalidReq.error) {
    return NextResponse.json(
      ...failResponse("Invalid request format.", 400, invalidReq.error.details),
    );
  }

  const admin = await prisma.admin.findUnique({
    where: {
      admin_email: req.email,
    },
  });

  if (!admin) {
    return NextResponse.json(
      ...failResponse("Email and/or password are incorrect.", 401),
    );
  }

  const isCorrectPassword = await comparePassword(
    req.password,
    admin.admin_hashedPassword,
  );

  if (!isCorrectPassword) {
    return NextResponse.json(
      ...failResponse("Username and/or password are incorrect.", 401),
    );
  }

  const accessToken = await createToken(
    admin.admin_id,
    process.env.ACCESS_TOKEN_DURATION,
  );

  if (accessToken.error) {
    return NextResponse.json(...errorResponse());
  }

  const refreshToken = await createToken(
    admin.admin_id,
    process.env.REFRESH_TOKEN_DURATION,
  );

  if (refreshToken.error) {
    return NextResponse.json(...errorResponse());
  }

  const createdSession = await prisma.session.create({
    data: {
      session_id: refreshToken.payload.id,
      admin_id: admin.admin_id,
      refresh_token: refreshToken.token,
      expired_at: refreshToken.payload.expiredAt,
    },
  });

  if (!createdSession) {
    return NextResponse.json(...errorResponse());
  }

  const res = {
    session_id: createdSession.admin_id,
    access_token: accessToken.token,
    access_token_expire_at: accessToken.payload.expiredAt,
    refresh_token: refreshToken.token,
    refresh_token_expire_at: refreshToken.payload.expiredAt,
    admin: {
      full_name: admin.fullName,
      email: admin.email,
    },
  };

  const cookie = cookies();
  cookie.set("session_id", res.session_id);
  cookie.set("access_token", res.access_token);
  cookie.set("refresh_token", res.refresh_token);

  return NextResponse.json(...successResponse(res));
}
