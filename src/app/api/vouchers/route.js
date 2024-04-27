import prisma from "@/lib/prisma";
import { successResponse } from "@/utils/response";
import { NextResponse } from "next/server";

export async function GET() {
  const vouchers = await prisma.discount.findMany({
    where: {
      number_of_uses: {
        lt: prisma.discount.fields.usage_limits,
      },
    },
    select: {
      discount_code: true,
      discount_value: true,
      is_percent_discount: true,
      maximum_discount_amount: true,
      is_limited: true,
    },
  });

  return NextResponse.json(...successResponse({ vouchers }));
}
