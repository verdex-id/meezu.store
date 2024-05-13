import { cookies } from "next/headers";
import Link from "next/link";
import MarkAsDoneScreen from "./mark_as_done_screen";
import ShipScreen from "./ship_screen";

async function getOrderByCode(id) {
  const cookie = cookies();

  const res = await fetch(process.env.BASE_URL + "/api/myshop_orders/" + id, {
    headers: {
      Authorization: "Bearer " + cookie.get("access_token").value,
    },
  }).then((r) => r.json());
  return res.data.orders;
}

export default async function AdminDashboardOrderDetail({ params }) {
  const order = await getOrderByCode(params.orderId);

  return (
    <div className="w-full max-w-screen-xl mx-auto px-8 min-h-dvh">
      <div className="p-5 w-full max-w-screen-sm mx-auto bg-white">
        <h1 className="font-bold text-center">Detail Pesanan</h1>
        {order ? (
          <>
            <div className="mt-5 bg-slate-100 p-5">
              <p className="font-medium">
                <span className="font-normal">Order Status</span>{" "}
                {order.order_status.replace("_", " ").toUpperCase()}{" "}
                <Link
                  href={"/track/" + order.order_code}
                  className="text-cyan-700 font-normal text-sm"
                  target="_blank"
                >
                  (Track Pengiriman)
                </Link>
              </p>
              <p className="font-medium">
                <span className="font-normal">Shipment Status</span>{" "}
                <span className="uppercase">
                  {order.shipment.shipment_status}
                </span>{" "}
                <Link
                  href={"/track/" + order.order_code}
                  className="text-cyan-700 font-normal text-sm"
                  target="_blank"
                >
                  (Track Pengiriman)
                </Link>
              </p>
              <p className="text-sm">{order.order_code}</p>
            </div>
            <div className="mt-5 bg-slate-100 p-5">
              <p>{order.guest_order.guest_email}</p>
              <p>{order.invoice.customer_full_address}</p>
              <p>Catatan: {order.guest_order.guest_note_for_courier}</p>
            </div>

            <div className="mt-5 bg-slate-100 p-5">
              {order.invoice.invoice_item.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 px-2"
                >
                  <h1>
                    {item.invoice_item_quantity}x {item.invoice_item_name}
                  </h1>
                  <h2>
                    Rp
                    {Intl.NumberFormat("id-ID").format(
                      item.invoice_item_total_price
                    )}
                  </h2>
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 px-2">
                <h1>Shipping Cost</h1>
                <h2>
                  Rp
                  {Intl.NumberFormat("id-ID").format(
                    order.invoice.shipping_cost
                  )}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 px-2">
                <h1>Discount Amount</h1>
                <h2>
                  Rp
                  {Intl.NumberFormat("id-ID").format(
                    order.invoice.discount_amount
                  )}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 px-2 font-medium">
                <h1>Subtotal</h1>
                <h2>
                  Rp
                  {Intl.NumberFormat("id-ID").format(order.invoice.net_price)}
                </h2>
              </div>
            </div>

            <div className="mt-5 bg-slate-100 p-5">
              <p className="font-medium">
                Rp{Intl.NumberFormat("id-ID").format(order.invoice.net_price)}
              </p>
            </div>

            <div className="text-center text-xs text-slate-700 mt-5">
              <p>
                Telah dibayar pada{" "}
                <span className="font-medium">
                  {new Date(order.invoice.payment_date).toLocaleString("id-ID")}
                </span>
              </p>
              <p>
                {order.payment.payment_method} - ID:{" "}
                {order.payment.paygate_transaction_id}
              </p>
            </div>

            {order.order_status == "AWAITING_FULFILLMENT" && (
              <ShipScreen order={order} />
            )}

            {order.order_status == "ARRIVED" &&
              order.shipment.shipment_status == "delivered" && (
                <MarkAsDoneScreen orderId={params.orderId} />
              )}
          </>
        ) : (
          <p>Error: Order Not Found</p>
        )}
      </div>
    </div>
  );
}
