export function invoiceItemsListToBiteshipItemList(invoiceItems) {
  const biteshipItemList = invoiceItems.map((item) => ({
    name: item.invoice_item_name,
    value: item.invoice_item_price,
    weight: item.invoice_item_weight,
    quantity: item.invoice_item_quantity,
  }));

  return biteshipItemList;
}

export function invoiceItemsListToTripayItems(invoiceItems) {
  const tripayItems = invoiceItems.map((item) => ({
    name: item.invoice_item_name,
    price: item.invoice_item_price,
    quantity: item.invoice_item_quantity,
  }));

  return tripayItems;
}

