import { retrieveCouriers } from "@/services/biteship";
import { successResponse } from "@/utils/response";
import { NextResponse } from "next/server";

export async function GET() {
  const couriers = await retrieveCouriers();
  return NextResponse.json(...successResponse({ couriers }));
}
