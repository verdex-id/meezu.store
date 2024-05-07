export async function prepareData(invoiceItems) {
  const datas = {
    tripayItems: [],
    prouductIterationBulkUpdateQuery: ``,
    prouductIterationBulkUpdateValues: [],
  };
  try {
    let subqueries = ``;
    invoiceItems.forEach((item, i) => {
      datas.tripayItems.push({
        name: item.invoice_item_name,
        price: item.invoice_item_price,
        quantity: item.invoice_item_quantity,
      });

      subqueries +=
        i < invoiceItems.length - 1
          ? `SELECT ? AS product_iteration_id, ? AS quantity UNION ALL `
          : `SELECT ? AS product_iteration_id, ? AS quantity `;
      datas.prouductIterationBulkUpdateValues.push(
        item.product_iteration_id,
        item.invoice_item_quantity,
      );
    });

    datas.prouductIterationBulkUpdateQuery = `
UPDATE ProductIteration AS p 
JOIN(${subqueries}) AS t 
ON p.product_iteration_id = t.product_iteration_id 
SET p.product_variant_stock = p.product_variant_stock - t.quantity `;
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
