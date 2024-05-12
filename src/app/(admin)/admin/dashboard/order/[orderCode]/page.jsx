import { cookies } from "next/headers";

async function getOrderByCode(code) {
  const cookie = cookies();

  const res = await fetch(process.env.BASE_URL + "/api/myshop_orders/" + code, {
    headers: {
      Authorization: "Bearer " + cookie.get("access_token").value,
    },
  }).then((r) => r.json());

  return res.data.orders;
}

export default async function AdminDashboardOrderDetail({ params }) {
  const order = await getOrderByCode(params.code);
  return (
    <div className="w-full max-w-screen-xl mx-auto px-8 min-h-dvh">
      <h1 className="font-bold">Detail Pesanan</h1>

      <div className="p-5 w-full max-w-screen-sm">
        <div className="mt-5 bg-slate-100 p-5">
          <p className="font-medium uppercase">{order.order_status}</p>
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
        </div>

        <div className="mt-5 bg-slate-100 p-5">
          <p className="font-medium">
            Rp{Intl.NumberFormat("id-ID").format(order.invoice.net_price)}
          </p>
        </div>

        <div>
          <p>{order.invoice.payment_date}</p>
        </div>
      </div>
    </div>
  );
}
