import { successResponse } from "@/utils/response";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const biteshipCallbackKey = process.env.BITESHIP_CALLBACK_SIGNATURE_KEY;
  const orderStatus = {
    event: "order.status",
  };

  const orderPrice = {
    event: "order.price",
  };

  const orderWaybill = {
    event: "order.waybill_id",
  };

  const status = crypto
    .createHmac("sha256", biteshipCallbackKey)
    .update(JSON.stringify(orderStatus))
    .digest("hex");

  const price = crypto
    .createHmac("sha256", biteshipCallbackKey)
    .update(JSON.stringify(orderPrice))
    .digest("hex");

  const waybill = crypto
    .createHmac("sha256", biteshipCallbackKey)
    .update(JSON.stringify(orderWaybill))
    .digest("hex");

  return NextResponse.json(
    ...successResponse({
      signatures: {
        status,
        price,
        waybill,
      },
    }),
  );
}

export async function POST(request) {}
