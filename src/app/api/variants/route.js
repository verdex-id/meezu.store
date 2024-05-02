import prisma from "@/lib/prisma";
import { successResponse } from "@/utils/response";
import { Sen } from "next/font/google";
import { NextResponse } from "next/server";

export async function GET(request) {
  // const schema = Joi.object({
  //   type: Joi.string()
  //     .pattern(/^[a-z_]+$/)
  //     .required(),
  // });

  const { searchParams } = new URL(request.url);
  const variantType = searchParams.get("variant_type");
  const variantTypeId = searchParams.get("variant_type_id");

  const response = {};
  if (variantType || variantTypeId) {
    response["variant_names"] = await prisma.variant.findMany({
      where: {
        OR: [
          {
            varian_type: {
              variant_type_name: variantType ? variantType : "",
            },
          },
          {
            varian_type_id: variantTypeId ? parseInt(variantTypeId) : 0,
          },
        ],
      },
    });
  } else {
    response["variant_types"] = await prisma.variantType.findMany();
  }

  console.log(variantType);

  return NextResponse.json(...successResponse(response));
}
