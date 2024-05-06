import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const baseUrl = process.env.TRIPAY_API_KEY.includes("DEV-")
    ? "https://tripay.co.id/api-sandbox"
    : "https://tripay.co.id/api";

  const res = await fetch(
    baseUrl + `/merchant/transactions?reference=${params.reference}`,
    {
      headers: {
        Authorization: "Bearer " + process.env.TRIPAY_API_KEY,
      },
    }
  );
  const response = await res.json();

  if (response.data.length == 0) {
    return NextResponse.json({
      status: 404,
      message: "Not Found",
    });
  }

  const resInstruction = await fetch(
    baseUrl + `/payment/instruction?code=${response.data[0].payment_method}`,
    {
      headers: {
        Authorization: "Bearer " + process.env.TRIPAY_API_KEY,
      },
    }
  ).then((r) => r.json());

  return NextResponse.json({
    status: 200,
    data: {
      payment: response.data[0],
      instruction: resInstruction.data,
    },
  });
}
