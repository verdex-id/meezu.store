import prisma from "@/lib/prisma";
import { successResponse } from "@/utils/response";
import { NextResponse } from "next/server";

export async function GET() {
    const categories = await prisma.productCategory.findMany();

    return NextResponse.json(...successResponse({ categories: categories }));
}
