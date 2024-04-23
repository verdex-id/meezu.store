import prisma from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import { JSONPath } from "jsonpath-plus";

export async function makeInvoiceItemsList(tx, request) {
  const invoiceItemIds = JSONPath({
    path: `$.order_items[*].product_iteration_id`,
    json: request,
  });

  if (new Set(invoiceItemIds).size !== invoiceItemIds.length) {
    return {
      invoiceItems: null,
      error: new FailError(
        "Cannot purchase the same product separately. Please combine identical products into one order item",
        400,
      ),
    };
  }

  const productIterations = await prisma.productIteration.findMany({
    where: {
      product_iteration_id: { in: invoiceItemIds },
    },
    select: {
      product_iteration_id: true,
      product_variant_weight: true,
      product_variant_price: true,
      product_variant_stock: true,
      product_variant_mapping: {
        select: {
          variant: {
            select: {
              variant_name: true,
            },
          },
        },
      },
      product: {
        select: {
          product_name: true,
          product_discounts: {
            select: {
              discount: true,
            },
          },
        },
      },
    },
  });

  if (productIterations.length !== invoiceItemIds.length) {
    return {
      invoiceItems: null,
      error: new FailError("Some items purchased could not be found", 404),
    };
  }

  const invoiceItems = [];

  try {
    let values = [];
    let cases = ``;
    let wheres = ``;

    productIterations.forEach((itr, i) => {
      const combinedVariantName =
        itr.product.product_name +
        JSONPath({
          path: `$.product_variant_mapping[*].variant.variant_name`,
          json: itr,
        }).reduce((sb, varName) => {
          return sb + " " + varName;
        }, "");

      const invoiceItemQuantity = request.order_items[i].quantity;

      if (itr.product_variant_stock < invoiceItemQuantity) {
        throw new FailError(
          "Insufficient stock available for the requested quantity ",
          409,
          combinedVariantName,
        );
      }

      let invoiceItemPrice = itr.product_variant_price;

      if (itr.product.product_discounts) {
        if (itr.product.product_discounts.discount.is_percent_discount) {
          invoiceItemPrice =
            invoiceItemPrice -
            invoiceItemPrice *
              (itr.product.product_discounts.discount.discount_value / 100);
        }
        invoiceItemPrice =
          invoiceItemPrice -
          itr.product.product_discounts.discount.discount_value;
      }

      cases += `WHEN product_iteration_id = ? THEN product_variant_stock - ? `;
      values.push(itr.product_iteration_id);
      values.push(invoiceItemQuantity);
      wheres += i > 0 ? ",?" : "?";

      invoiceItems.push({
        invoice_item_name: combinedVariantName,
        invoice_item_quantity: invoiceItemQuantity,
        invoice_item_weight: itr.product_variant_weight,
        invoice_item_total_weight:
          itr.product_variant_weight * invoiceItemQuantity,
        invoice_item_price: invoiceItemPrice,
        invoice_item_total_price: invoiceItemPrice * invoiceItemQuantity,
        product_iteration_id: itr.product_iteration_id,
      });
    });

    let query = `UPDATE ProductIteration SET product_variant_stock = CASE ${cases} ELSE product_variant_stock END WHERE product_iteration_id IN (${wheres})`;

    const affected = await tx.$executeRawUnsafe(
      query,
      ...values,
      ...invoiceItemIds,
    );
    if (affected !== invoiceItemIds.length) {
      throw new FailError("Several records not found for update", 404);
    }
  } catch (e) {
    return {
      invoiceItems: null,
      error: e,
    };
  }

  return {
    invoiceItems: invoiceItems,
    error: null,
  };
}
