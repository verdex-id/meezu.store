import prisma from "@/lib/prisma";
import { authPayloadAccountId } from "@/middleware";
import { mapsDoubleSearch } from "@/services/biteship";
import { ErrorWithCode } from "@/utils/custom-error";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const payloadAdminId = headers().get(authPayloadAccountId);

    let admin = await prisma.admin.findUnique({
        where: {
            admin_id: payloadAdminId,
        },
    });

    if (!admin) {
        return NextResponse.json(...errorResponse());
    }

    let address;
    try {
        address = await prisma.originAddress.findUnique({
            where: {
                origin_address_id: parseInt(params.addressId),
            },
        });

        if (!address) {
            throw new ErrorWithCode("Address not found", 404);
        }
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            return NextResponse.json(...failResponse(prismaErrorCode[e.code], 409));
        }

        if (e instanceof ErrorWithCode) {
            return NextResponse.json(...failResponse(e.message, e.code));
        }

        return NextResponse.json(...errorResponse());
    }

    return NextResponse.json(...successResponse({ address: address }));
}

export async function PUT(request, { params }) {
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
        new_area_id: Joi.string().required(),
        new_address: Joi.string().max(200).required(),
        new_phone_number: Joi.string()
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

    const area = await mapsDoubleSearch(req.new_area_id);

    if (!area.area) {
        return NextResponse.json(
            ...failResponse("Area not found", 404, area.error),
        );
    }

    let newAddress;
    try {
        newAddress = await prisma.originAddress.update({
            where: {
                origin_address_id: parseInt(params.addressId),
            },
            data: {
                phone_number: req.new_phone_number,
                address: req.new_address,
                province: area.area.administrative_division_level_1_name,
                city: area.area.administrative_division_level_2_name,
                district: area.area.administrative_division_level_3_name,
                postal_code: area.area.postal_code.toString(),
                area_id: area.area.id,
                admin_id: admin.admin_id,
            },
        });

        if (!newAddress) {
            throw new ErrorWithCode("Address not found", 404);
        }
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            return NextResponse.json(...failResponse(prismaErrorCode[e.code], 409));
        }

        if (e instanceof ErrorWithCode) {
            return NextResponse.json(...failResponse(e.message, e.code));
        }

        return NextResponse.json(...errorResponse());
    }

    return NextResponse.json(...successResponse({ new_address: newAddress }));
}

export async function DELETE(request, { params }) {
    const payloadAdminId = headers().get(authPayloadAccountId);

    let admin = await prisma.admin.findUnique({
        where: {
            admin_id: payloadAdminId,
        },
    });

    if (!admin) {
        return NextResponse.json(...errorResponse());
    }

    let deletedAddress;
    try {
        deletedAddress = await prisma.originAddress.delete({
            where: {
                origin_address_id: parseInt(params.addressId),
            },
        });
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            return NextResponse.json(...failResponse(prismaErrorCode[e.code], 409));
        }

        return NextResponse.json(...errorResponse());
    }

    return NextResponse.json(
        ...successResponse({ deleted_address: deletedAddress }),
    );
}
