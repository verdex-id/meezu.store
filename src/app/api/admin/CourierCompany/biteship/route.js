import { successResponse } from "@/utils/response"
import { NextResponse } from "next/server"

export async function GET() {

    const courierCompanies = ["gojek",
    "grab",
    "deliveree",
    "jne",
    "tiki",
    "ninja",
    "rara",
    "sicepat",
    "jnt",
    "idexpress",
    "rpx",
    "jdl",
    "wahana",
    "pos",
    "anteraja",
    "sap",
    "paxel",
    "mrspeedy",
    "borzo",
    "lalamove"]
   
    return NextResponse.json(...successResponse({courier_companies : courierCompanies}))
}