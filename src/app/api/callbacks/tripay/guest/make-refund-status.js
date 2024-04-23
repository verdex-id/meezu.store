import prisma from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import { orderStatus } from "@/utils/order-status";
import { paymentStatus } from "@/utils/payment-status";
import { restoreProductIterationStock } from "./make-failed-status";

export async function makeRefundStatus(order) {
  try {
    if (
      order.order_status !== orderStatus.awaitingRefund ||
      order.invoice.payment_status !== paymentStatus.paid
    ) {
      throw new FailError("This order cannot be refunded", 400);
    }

    await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: {
          order_id: order.order_id,
          order_status: orderStatus.awaitingRefund,
        },
        data: { order_status: orderStatus.refunded },
        select: {
          order_id: true,
          order_status: true,
          discount_code: true,
          invoice: {
            select: {
              invoice_id: true,
              invoice_item: {
                select: {
                  invoice_item_quantity: true,
                  product_iteration_id: true,
                },
              },
            },
          },
        },
      });

      await tx.invoice.update({
        where: {
          invoice_id: updatedOrder.invoice.invoice_id,
          payment_status: paymentStatus.paid,
        },
        data: {
          payment_status: paymentStatus.refund,
        },
        select: {
          invoice_item: {
            select: {
              invoice_item_quantity: true,
              product_iteration: {
                select: {
                  product_iteration_id: true,
                  product_variant_stock: true,
                },
              },
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

      const error = await restoreProductIterationStock(
        tx,
        updatedOrder.invoice.invoice_item
      );
      if (error) {
        throw error.error;
      }
    });
  } catch (e) {
    return {
      error: e,
    };
  }
}