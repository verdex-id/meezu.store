import prisma from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import { JSONPath } from "jsonpath-plus";

export async function prepareData(request) {
  const datas = {
    biteshipItems: [],
  };
  try {
    const invoiceItemIds = JSONPath({
      path: `$.order_items[*].product_iteration_id`,
      json: request,
    });

    if (new Set(invoiceItemIds).size !== invoiceItemIds.length) {
      throw new FailError(
        "Please combine identical products into one order item",
        400,
      );
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
      throw new FailError("Some items purchased could not be found", 404);
    }

    productIterations.forEach((itr, i) => {
      const combinedVariantName =
        itr.product.product_name +
        JSONPath({
          path: `$.product_variant_mapping[*].variant.variant_name`,
          json: itr,
        }).reduce((sb, varName) => {
          return sb + " " + varName;
        }, "");

      const itemQuantity = request.order_items[i].quantity;

      if (itr.product_variant_stock < itemQuantity) {
        throw new FailError(
          "Insufficient stock available for the requested quantity ",
          409,
          combinedVariantName,
        );
      }

      let itemPrice = itr.product_variant_price;
      if (itr.product.product_discounts) {
        if (itr.product.product_discounts.discount.is_percent_discount) {
          itemPrice =
            itemPrice -
            itemPrice *
              (itr.product.product_discounts.discount.discount_value / 100);
        }
        itemPrice =
          itemPrice - itr.product.product_discounts.discount.discount_value;
      }

      datas.biteshipItems.push({
        name: combinedVariantName,
        value: itemPrice,
        weight: itr.product_variant_weight,
        quantity: itemQuantity,
      });
    });
  } catch (e) {
    return {
      datas: null,
      error: e,
    };
  }

  return {
    datas: datas,
    error: null,
  };
}
