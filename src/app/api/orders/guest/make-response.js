export function makeResponse(order, biteshipItem, shipmentPricing) {
  const response = {
    guest_order_code: order.order_code,
    payment_details: {
      total_purchases: {
        total_item: order.invoice._count.invoice_item,
        total_price: order.invoice.gross_price ,
        discount_amount: order.invoice.discount_amount,
        shipping_cost: order.invoice.shipping_cost,
      },
      net_price: order.invoice.net_price,
      purchased_items: biteshipItem,
      shipment: {
        cost: shipmentPricing.price,
        courier_name: shipmentPricing.courier_name,
        courier_service_name: shipmentPricing.courier_service_name,
        estimation: shipmentPricing.shipment_duration_range,
        estimation_unit: shipmentPricing.shipmment_duration_unit,
        destination_address: order.invoice.customer_full_address,
      },
    },
  };

  return response;
}
