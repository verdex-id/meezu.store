import prisma, { prismaErrorCode } from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import { orderStatus } from "@/utils/order-status";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import Joi from "joi";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(request) {
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
        OR: [
          {
            order_status: orderStatus.incomplete,
          },
          {
            order_status: orderStatus.awaitingPayment,
          },
        ],
      },
      select: {
        order_id: true,
        order_status: true,
        order_code: true,
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
      throw new FailError(`Order not found`, 404);
    }

    let prouductIterationBulkUpdateQuery;
    let prouductIterationBulkUpdateValues;
    if (order.order_status === orderStatus.awaitingPayment) {
      const query = createRestoreProductQuery(order.invoice.invoice_item);
      prouductIterationBulkUpdateQuery = query.prouductIterationBulkUpdateQuery;
      prouductIterationBulkUpdateValues =
        query.prouductIterationBulkUpdateValues;
    }

    await prisma.$transaction(async (tx) => {
      if (order.discount_code) {
        await tx.discount.update({
          where: {
            discount_code: order.discount_code,
          },
          data: {
            number_of_uses: { decrement: 1 },
          },
        });
      }

      if (order.order_status === orderStatus.awaitingPayment) {
        const affected = await tx.$executeRawUnsafe(
          prouductIterationBulkUpdateQuery,
          ...prouductIterationBulkUpdateValues,
        );

        if (affected !== order.invoice.invoice_item.length) {
          throw new FailError("Several records not found for update", 404);
        }
      }

      await tx.order.delete({
        where: {
          order_id: order.order_id,
        },
      });

      const cookie = cookies();
      cookie.delete("active_order_code");
    });
  } catch (e) {
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
    ...successResponse({
      deleted_order: {
        order_code: order.order_code,
      },
    }),
  );
}

function createRestoreProductQuery(invoiceItems) {
  const prouductIterationBulkUpdateValues = [];
  let subqueries = ``;

  invoiceItems.forEach((item, i) => {
    subqueries +=
      i < invoiceItems.length - 1
        ? `SELECT ? AS product_iteration_id, ? AS quantity UNION ALL `
        : `SELECT ? AS product_iteration_id, ? AS quantity `;

    prouductIterationBulkUpdateValues.push(
      item.product_iteration_id,
      item.invoice_item_quantity,
    );
  });

  const prouductIterationBulkUpdateQuery = ` UPDATE ProductIteration AS p 
JOIN(${subqueries}) AS t 
ON p.product_iteration_id = t.product_iteration_id 
SET p.product_variant_stock = p.product_variant_stock + t.quantity `;

  return {
    prouductIterationBulkUpdateQuery,
    prouductIterationBulkUpdateValues,
  };
}
