import { cookies } from "next/headers";
import Link from "next/link";

async function getOrders(status) {
  const cookie = cookies();

  const res = await fetch(
    process.env.BASE_URL + "/api/myshop_orders?status=" + status,
    {
      headers: {
        Authorization: "Bearer " + cookie.get("access_token").value,
      },
    }
  ).then((r) => r.json());

  return res.data.orders;
}

export default async function AdminDashboardOrder() {
  const orders = await getOrders("all_order");
  return (
    <div className="w-full max-w-screen-xl mx-auto px-8 min-h-dvh">
      <h1 className="font-bold">Daftar Pesanan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {orders.map((order, i) => (
          <Link
            href={"/admin/dashboard/order/" + order.order_code}
            key={i}
            className="p-5"
          >
            <div>
              <p className="font-medium uppercase">{order.order_status}</p>
              <p className="text-sm">{order.order_code}</p>
            </div>
            <div>
              <p>{order.guest_order.guest_email}</p>
              <p>{order.invoice.customer_full_address}</p>
              <p>Catatan: {order.guest_order.guest_note_for_courier}</p>
            </div>

            <div>
              <p>
                Rp{Intl.NumberFormat("id-ID").format(order.invoice.net_price)}
              </p>
            </div>

            <div>
              <p>{order.invoice.payment_date}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
