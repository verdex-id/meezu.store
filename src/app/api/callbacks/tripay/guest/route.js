import prisma, { prismaErrorCode } from "@/lib/prisma";
import { tripayCallbackSignature } from "@/services/tripay";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { makePaidStatus } from "./make-paid-status";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { FailError } from "@/utils/custom-error";
import { makeFailedStatus } from "./make-failed-status";
import { makeRefundStatus } from "./make-refund-status";

export async function POST(request) {
  try {
    const callbackSignature = headers().get("X-Callback-Signature");
    const callbackEvent = headers().get("X-Callback-Event");
    let req = await request.json();

    const jsonString = JSON.stringify(req);
    req = JSON.parse(jsonString);

    if (req === null) {
      throw new FailError("Invalid data sent by tripay", 400);
    }

    const signature = tripayCallbackSignature(jsonString);

    if (signature !== callbackSignature) {
      throw new FailError("Invalid signature", 400);
    }

    if (callbackEvent !== "payment_status") {
      throw new FailError(
        "Unrecognized callback event, no action was taken",
        400,
      );
    }

    if (!req.is_closed_payment === 1) {
      throw new FailError("Open payment not supported", 400);
    }
    const order = await prisma.order.findUnique({
      where: {
        order_code: req.merchant_ref,
        payment: {
          paygate_transaction_id: req.reference,
          payment_method: req.payment_method_code,
        },
      },
      select: {
        order_id: true,
        order_status: true,
        discount_code: true,
        invoice: {
          select: {
            invoice_id: true,
            invoice_item: true,
            payment_status: true,
          },
        },
      },
    });

    if (!order) {
      throw new FailError(
        `No order found with merchant reference : ${req.merchant_ref}`,
        404,
      );
    }

    let error;
    switch (req.status.toUpperCase()) {
      case "PAID":
        error = await makePaidStatus(order);
        break;
      case "EXPIRED":
        error = await makeFailedStatus(order);
        break;
      case "FAILED":
        error = await makeFailedStatus(order);
        break;
      case "REFUND":
        error = await makeRefundStatus(order);
        break;
      default:
        throw new FailError("Unrecognized payment status", 400);
    }
    if (error) {
      throw error.error;
    }
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return NextResponse.json(
          ...tripayResponse(false, `${e.meta.modelName} not found`, 404),
        );
      }
      return NextResponse.json(
        ...tripayResponse(false, prismaErrorCode[e.code], 409),
      );
    }

    if (e instanceof FailError) {
      return NextResponse.json(...tripayResponse(false, e.message, e.code));
    }

    return NextResponse.json(...tripayErrorResponse());
  }

  return NextResponse.json({ success: true });
}

function tripayErrorResponse() {
  return [
    {
      success: false,
      message:
        "We're sorry, but something unexpected happened. Please try again later.",
    },
    {
      status: 500,
    },
  ];
}

function tripayResponse(isSuccess, message, status) {
  return [
    {
      success: isSuccess,
      message: message,
    },
    {
      status: status,
    },
  ];
}
