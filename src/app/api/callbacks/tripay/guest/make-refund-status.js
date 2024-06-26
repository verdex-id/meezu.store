import prisma from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import { orderStatus } from "@/utils/order-status";
import { paymentStatus } from "@/utils/payment-status";
import { createRestoreProductQuery } from "./make-failed-status";

export async function makeRefundStatus(order) {
  try {
    if (
      order.order_status !== orderStatus.awaitingRefund ||
      order.invoice.payment_status !== paymentStatus.paid
    ) {
      throw new FailError("This order cannot be refunded", 400);
    }

    const {
      prouductIterationBulkUpdateQuery,
      prouductIterationBulkUpdateValues,
    } = createRestoreProductQuery(order.invoice.invoice_item);

    await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: {
          order_id: order.order_id,
          order_status: orderStatus.awaitingRefund,
          invoice: {
            payment_status: paymentStatus.paid,
          },
        },
        data: {
          order_status: orderStatus.refunded,
          invoice: {
            update: {
              payment_status: paymentStatus.refund,
            },
          },
        },
        select: {
          order_id: true,
          order_status: true,
          discount_code: true,
          invoice: {
            select: {
              invoice_id: true,
            },
          },
        },
      });

      if (updatedOrder.discount_code) {
        await tx.discount.update({
          where: {
            discount_code: updatedOrder.discount_code,
          },
          data: {
            number_of_uses: { decrement: 1 },
          },
        });
      }

      const affected = await tx.$executeRawUnsafe(
        prouductIterationBulkUpdateQuery,
        ...prouductIterationBulkUpdateValues,
      );

      if (affected !== order.invoice.invoice_item.length) {
        throw new FailError("Several records not found for update", 404);
      }
    });
  } catch (e) {
    return {
      error: e,
    };
  }
}
