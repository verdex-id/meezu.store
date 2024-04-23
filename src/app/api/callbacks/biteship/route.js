import { successResponse } from "@/utils/response";
import { NextResponse } from "next/server";

export async function POST(request) {
    const req = await request.json();
    return NextResponse.json(
        ...successResponse({ nothing: "nothing", req: req }),
    );
}

export async function GET(request) {
    return NextResponse.json(
        ...successResponse({ nothing: "nothing"}),
    );
}
