import { NextResponse } from "next/server"

const { func } = require("joi")

// API ROUTE HERE
export async function GET() {
    return NextResponse.json({ tes: "tes" })
}
