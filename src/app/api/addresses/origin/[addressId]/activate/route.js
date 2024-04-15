import prisma, { prismaErrorCode } from "@/lib/prisma";
import { authPayloadAccountId } from "@/middleware";
import { ErrorWithCode } from "@/utils/custom-error";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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

  let updatedAddress;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.originAddress.updateMany({
        where: {
          is_active: true,
        },
        data: {
          is_active: false,
        },
      });

      updatedAddress = await tx.originAddress.update({
        where: {
          origin_address_id: parseInt(params.addressId),
        },
        data: {
          is_active: true,
        },
      });
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(...failResponse(prismaErrorCode[e.code], 409));
    }

    if (e instanceof ErrorWithCode) {
      return NextResponse.json(...failResponse(e.message, e.code));
    }

    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(
    ...successResponse({ updated_address: updatedAddress }),
  );
}
