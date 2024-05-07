export function makeResponse(order, invoice, transaction, purchasedItems) {
  const response = {
    temp_trip_ref: transaction.reference, // delete after
    guest_order_code: order.order_code,
    payment_details: {
      total_purchases: {
        total_item: order.invoice.invoice_item.length,
        total_price: invoice.gross_price,
        discount_amount: invoice.discount_amount,
        shipping_cost: invoice.shipping_cost,
      },
      payment_method: transaction.payment_method,
      payment_code: transaction.pay_code,
      net_price: invoice.net_price,
      purchased_items: purchasedItems,
      shipment: {
        cost: order.invoice.shipping_cost,
        courier_name: order.shipment.courier.courier_name,
        courier_service_name: order.shipment.courier.courier_service_name,
        // estimation: shipment.shipment_duration_range,
        // estimation_unit: shipment.shipmment_duration_unit,
        // destination_address: order.invoice.customer_full_address,
      },
    },
    tripay_checkout_url: transaction.checkout_url,
    payment_instructions: transaction.instructions,
  };

  return response;
}
