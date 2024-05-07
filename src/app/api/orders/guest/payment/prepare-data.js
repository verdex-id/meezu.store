export async function prepareData(invoiceItems) {
    const datas = {
        tripayItems: [],
        prouductIterationBulkUpdateQuery: ``,
        prouductIterationBulkUpdateValues: [],
    };

    try {
        let subqueries = ``;
        invoiceItems.forEach((itr, i) => {
            datas.tripayItems.push({
                name: combinedVariantName,
                price: itemPrice,
                quantity: itemQuantity,
            });

            subqueries +=
                i < productIterations.length - 1
                    ? `SELECT ? AS product_iteration_id, ? AS quantity UNION ALL `
                    : `SELECT ? AS product_iteration_id, ? AS quantity `;
            datas.prouductIterationBulkUpdateValues.push(
                itr.product_iteration_id,
                itemQuantity,
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
