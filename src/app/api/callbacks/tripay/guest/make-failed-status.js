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

    const {
      prouductIterationBulkUpdateQuery,
      prouductIterationBulkUpdateValues,
    } = createRestoreProductQuery(order.invoice.invoice_item);

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

      const deleteBasedOnOrderId = {
        where: {
          order_id: order.order_id,
        },
      };
      await tx.guestOrder.delete(deleteBasedOnOrderId);
      await tx.shipment.delete(deleteBasedOnOrderId);
      await tx.payment.delete(deleteBasedOnOrderId);

      const deletedInvoiceItemsCount = await tx.invoiceItem.deleteMany({
        where: {
          invoice_id: order.invoice.invoice_id,
        },
      });

      await tx.invoice.delete(deleteBasedOnOrderId);

      const affected = await tx.$executeRawUnsafe(
        prouductIterationBulkUpdateQuery,
        ...prouductIterationBulkUpdateValues,
      );

      if (affected !== deletedInvoiceItemsCount.count) {
        throw new FailError("Several records not found for update", 404);
      }

      await tx.order.delete(deleteBasedOnOrderId);
    });
  } catch (e) {
    return {
      error: e,
    };
  }
}

export function createRestoreProductQuery(invoiceItems) {
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
