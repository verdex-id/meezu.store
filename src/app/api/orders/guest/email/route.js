import prisma from "@/lib/prisma";
import { getDetailTransaction } from "@/services/tripay";
import { FailError } from "@/utils/custom-error";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import { emailHTML, emailText } from "../payment/make-email";
import Joi from "joi";
import { sendEmail } from "@/services/email";

export async function GET(request) {
  let order;
  try {
    const schema = Joi.object({
      order_code: Joi.string()
        .pattern(/^[A-Z0-9-]{27,}$/)
        .required(),
    });

    const { searchParams } = new URL(request.url);
    const orderCode = searchParams.get("order_code");
    let req = schema.validate({
      order_code: orderCode,
    });
    if (req.error) {
      throw new FailError("invalid request format", 400, req.error.details);
    }
    req = req.value;

    order = await prisma.order.findUnique({
      where: {
        order_code: req.order_code,
        payment: { isNot: null },
      },
      select: {
        order_code: true,
        guest_order: {
          select: {
            guest_email: true,
          },
        },
        payment: {
          select: {
            paygate_transaction_id: true,
          },
        },
      },
    });
    if (!order) {
      throw new FailError("Order not found", 404);
    }

    const response = await getDetailTransaction(
      order.payment.paygate_transaction_id,
    );
    if (!response.success) {
      throw new FailError(response.message, 400);
    }

    const expireTime = new Date(
      response.data.expired_time * 1000,
    ).toLocaleString();

    const formatedPrice = response.data.amount
      .toLocaleString()
      .replace(/,/g, ".");

    await sendEmail(
      order.guest_order.guest_email,
      "Customer order",
      emailText(order.order_code, formatedPrice, expireTime),
      emailHTML(order.order_code, formatedPrice, expireTime),
    );
  } catch (e) {
        console.log(e)
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return NextResponse.json(
          ...failResponse(`${e.meta.modelName} not found`, 404),
        );
      }
      return NextResponse.json(
        ...failResponse(prismaErrorCode[e.code], 409, e.meta.modelName),
      );
    }

    if (e instanceof FailError) {
      return NextResponse.json(...failResponse(e.message, e.code, e.detail));
    }
    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(
    ...successResponse({ receiver: order.guest_order.guest_email }),
  );
}
