export function makeResponse(shipment, transaction, invoice, purchasedItems) {
  const response = {
    guest_order_code: transaction.merchant_ref,
    payment_details: {
      total_purchases: {
        total_item: invoice._count.invoice_item,
        total_price: invoice.gross_price - invoice.shipping_cost,
        discount_amount: invoice.discount_amount,
        shipping_cost: invoice.shipping_cost,
      },
      payment_method: transaction.payment_method,
      payment_code: transaction.pay_code,
      net_price: invoice.net_price,
      purchased_items: purchasedItems,
      shipment: {
        cost: shipment.price,
        courier_name: shipment.courier_name,
        courier_service_name: shipment.courier_service_name,
        estimation: shipment.shipment_duration_range,
        estimation_unit: shipment.shipmment_duration_unit,
        destination_address: invoice.customer_full_address,
      },
    },
    tripay_checkout_url: transaction.checkout_url,
    payment_instructions: transaction.instructions,
  };


  return response;
}
