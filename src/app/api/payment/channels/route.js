import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://tripay.co.id/api-sandbox/merchant/payment-channel",
    {
      headers: {
        Authorization:
          "Bearer DEV-qdi04Eud9OTwBB2lis0Cyab3cDJJa9NfIdfNX6bd",
      },
    }
  );
  const response = await res.json();
  return NextResponse.json({
    status: 200,
    data: response.data.filter(p => p.active == true)
  })
}