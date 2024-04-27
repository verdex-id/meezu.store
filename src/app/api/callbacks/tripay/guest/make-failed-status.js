import prisma from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import { orderStatus } from "@/utils/order-status";
import { paymentStatus } from "@/utils/payment-status";

export async function makeFailedStatus(order) {
  try {
    if (
      order.order_status !== orderStatus.awaitingPayment ||
      order.invoice.payment_status !== paymentStatus.unpaid
    ) {
      throw new FailError("This order cannot be processed further", 400);
    }

    await prisma.$transaction(async (tx) => {
      const selectedOrder = await tx.order.findUnique({
        where: {
          order_id: order.order_id,
          order_status: orderStatus.awaitingPayment,
        },
        select: {
          order_id: true,
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

      if (selectedOrder.discount_code) {
        await tx.discount.update({
          where: {
            discount_code: selectedOrder.discount_code,
          },
          data: {
            number_of_uses: { decrement: 1 },
          },
        });
      }

      const deleteBasedOnOrderId = {
        where: {
          order_id: selectedOrder.order_id,
        },
      };
      await tx.guestOrder.delete(deleteBasedOnOrderId);
      await tx.shipment.delete(deleteBasedOnOrderId);
      await tx.payment.delete(deleteBasedOnOrderId);

      const deletedInvoiceItemsCount = await tx.invoiceItem.deleteMany({
        where: {
          invoice_id: selectedOrder.invoice.invoice_id,
        },
      });

      await tx.invoice.delete(deleteBasedOnOrderId);

      const error = await restoreProductIterationStock(
        tx,
        selectedOrder.invoice.invoice_item,
        deletedInvoiceItemsCount,
      );
      if (error) {
        throw error.error;
      }

      await tx.order.delete(deleteBasedOnOrderId);
    });
  } catch (e) {
    return {
      error: e,
    };
  }
}

export async function restoreProductIterationStock(tx, invoiceItems) {
  const ids = [];
  const values = [];
  let cases = ``;
  let wheres = ``;

  invoiceItems.forEach((item, i) => {
    cases += `WHEN product_iteration_id = ? THEN product_variant_stock + ? `;
    ids.push(item.product_iteration_id);
    values.push(item.product_iteration_id);
    values.push(item.invoice_item_quantity);
    wheres += i > 0 ? ",?" : "?";
  });

  let query = `UPDATE ProductIteration SET product_variant_stock = CASE ${cases} ELSE product_variant_stock END WHERE product_iteration_id IN (${wheres})`;

  const affected = await tx.$executeRawUnsafe(query, ...values, ...ids);

  if (affected !== ids.length) {
    return {
      error: new FailError("Several records not found for update", 404),
    };
  }
}
