export function prepareData(invoiceItems) {
    const datas = {
        tripayItems: [],
        biteshipItems: [],
        grossPrice: 0,
        totalWeight: 0,
    };
    invoiceItems.forEach((item) => {
        datas.tripayItems.push({
            name: item.invoice_item_name,
            price: item.invoice_item_price,
            quantity: item.invoice_item_quantity,
        });

        datas.biteshipItems.push({
            name: item.invoice_item_name,
            value: item.invoice_item_price,
            weight: item.invoice_item_weight,
            quantity: item.invoice_item_quantity,
        });

        datas.grossPrice += item.invoice_item_total_price;
        datas.totalWeight += item.invoice_item_total_weight;
    });

    return datas
}
