import prisma from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import { orderStatus } from "@/utils/order-status";
import { paymentStatus } from "@/utils/payment-status";

export async function makePaidStatus(order) {
  try {
    if (
      order.order_status === orderStatus.awaitingFulfillment &&
      order.invoice.payment_status === paymentStatus.paid
    ) {
      throw new FailError("This order has already been paid for", 400);
    }

    if (
      order.order_status !== orderStatus.awaitingPayment ||
      order.invoice.payment_status !== paymentStatus.unpaid
    ) {
      throw new FailError(
        "This order cannot be processed further into the payment process",
        400,
      );
    }

    const currentTime = new Date().toISOString();

    await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: {
          order_id: order.order_id,
          order_status: orderStatus.awaitingPayment,
        },
        data: { order_status: orderStatus.awaitingFulfillment },
        select: {
          order_id: true,
          order_status: true,
          invoice: {
            select: {
              invoice_id: true,
              invoice_item: true,
            },
          },
        },
      });

      await tx.invoice.update({
        where: {
          invoice_id: updatedOrder.invoice.invoice_id,
          payment_status: paymentStatus.unpaid,
        },
        data: {
          payment_date: currentTime,
          payment_status: paymentStatus.paid,
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
    });
  } catch (e) {
    return {
      error: e,
    };
  }
}
