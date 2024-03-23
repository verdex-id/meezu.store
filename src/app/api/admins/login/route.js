import { createToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import Joi from "joi";
import { comparePassword } from "@/lib/password";
import prisma from "@/lib/prisma";

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
            ...failResponse("Username and/or password are incorrect.", 401),
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

    const res = {
        access_token: accessToken.token,
        access_token_expire_at: accessToken.payload.expiredAt,
        admin: {
            admin_full_name: admin.admin_full_name,
            admin_email: admin.admin_email,
            admin_created_at: admin.admin_created_at,
        },
    };
    return NextResponse.json(...successResponse(res));
}
