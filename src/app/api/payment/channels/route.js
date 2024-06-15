import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.TRIPAY_API_KEY.includes("DEV-")
    ? "https://tripay.co.id/api-sandbox/merchant/payment-channel"
    : "https://tripay.co.id/api/merchant/payment-channel";
  const res = await fetch(baseUrl, {
    headers: {
      Authorization: "Bearer " + process.env.TRIPAY_API_KEY,
    },
  });
  let response = await res.json();
  if (response.success) {
    return NextResponse.json({
      status: 200,
      data: response.data.filter((p) => p.active == true),
    });
  } else {
    return NextResponse.json({
      status: 500,
      data: [],
    });
  }
}
