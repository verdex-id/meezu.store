import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const baseUrl = process.env.TRIPAY_API_KEY.includes("DEV-")
    ? "https://tripay.co.id/api-sandbox"
    : "https://tripay.co.id/api";

  const res = await fetch(
    baseUrl + `/transaction/detail?reference=${params.reference}`,
    {
      headers: {
        Authorization: "Bearer " + process.env.TRIPAY_API_KEY,
      },
      next: {
        revalidate: 0,
      },
    }
  );
  const response = await res.json();

  const resInstruction = await fetch(
    baseUrl + `/payment/instruction?code=${response.data.payment_method}`,
    {
      headers: {
        Authorization: "Bearer " + process.env.TRIPAY_API_KEY,
      },
    }
  ).then((r) => r.json());

  return NextResponse.json({
    status: 200,
    data: {
      payment: response.data,
      instruction: resInstruction.data,
    },
  });
}
