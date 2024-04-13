import prisma, { prismaErrorCode } from "@/lib/prisma";
import { authPayloadAccountId } from "@/middleware";
import { mapsDoubleSearch } from "@/services/biteship";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
    const payloadAdminId = headers().get(authPayloadAccountId);

    let admin = await prisma.admin.findUnique({
        where: {
            admin_id: payloadAdminId,
        },
    });

    if (!admin) {
        return NextResponse.json(...errorResponse());
    }

    const schema = Joi.object({
        area_id: Joi.string().required(),
        address: Joi.string().max(200).required(),
        phone_number: Joi.string()
            .pattern(/^(?:\+?62)?[ -]?(?:\d[ -]?){9,15}\d$/)
            .required(),
    });

    const req = await request.json();

    const validationResult = schema.validate(req);
    if (validationResult.error) {
        return NextResponse.json(
            ...failResponse(
                "Invalid request format.",
                403,
                validationResult.error.details,
            ),
        );
    }

    const area = await mapsDoubleSearch(req.area_id);

    if (!area.area) {
        return NextResponse.json(
            ...failResponse("Area not found", 404, area.error),
        );
    }

    let createdAddress;
    try {
        createdAddress = await prisma.adminAddress.create({
            data: {
                phone_number: req.phone_number,
                address: req.address,
                province: area.area.administrative_division_level_1_name,
                city: area.area.administrative_division_level_2_name,
                district: area.area.administrative_division_level_3_name,
                postal_code: area.area.postal_code.toString(),
                area_id: area.area.id,
                admin_id: admin.admin_id,
            },
        });
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            return NextResponse.json(...failResponse(prismaErrorCode[e.code], 409));
        }
        return NextResponse.json(...errorResponse());
    }

    return NextResponse.json(...successResponse({ address: createdAddress }));
}
