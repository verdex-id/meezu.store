import { headers } from "next/headers";
import { Prisma } from "@prisma/client";
import { prismaErrorCode } from "@/lib/prisma";
import Joi from "joi";
import { failResponse, successResponse, errorResponse } from "@/utils/response";
import { authPayloadAccountId } from "@/middleware";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request) {
    const payloadAdminId = headers().get(authPayloadAccountId);

    const req = await request.json();

    let schema = Joi.object({
        new_name: Joi.string()
            .pattern(/^[A-Za-z\s']+$/)
            .min(3)
            .required(),
    });

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

    if (admin.admin_full_name === req.new_name) {
        return NextResponse.json(...failResponse("No changes were made.", 400));
    }

    try {
        admin = await prisma.admin.update({
            where: {
                admin_id: admin.admin_id,
            },
            data: {
                admin_full_name: req.new_name,
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
        ...successResponse({ admin_full_name: admin.admin_full_name }),
    );
}
