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

export default async function AdminDashboardOrder(req) {
  const filter = req.searchParams.filter;
  const orders = await getOrders(filter || "all_order");

  const filters = [
    "all_order",
    "new_order",
    "confirm_shipping",
    "in_shipping",
    "arrived",
    "done",
    "cancellation_request",
    "awaiting_refund",
    "refund",
  ];

  return (
    <div className="w-full max-w-screen-xl mx-auto px-8 min-h-dvh">
      <h1 className="font-bold">Daftar Pesanan</h1>

      <div className="flex items-center gap-2 overflow-x-scroll hide-scrollbar text-center flex-nowrap md:flex-wrap">
        {filters.map((f, i) => (
          <Link
            key={i}
            href={"/admin/dashboard/order?filter=" + f}
            className={`px-5 py-2 w-max text-nowrap ${
              filter == f
                ? "bg-cyan-400 border-2 border-cyan-400 text-white"
                : "bg-transparent border-2 border-cyan-400 text-cyan-700"
            }`}
          >
            <p className="uppercase">{f.replace("_", " ")}</p>
          </Link>
        ))}
      </div>

      {orders ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5">
          {orders.map((order, i) => (
            <Link
              href={"/admin/dashboard/order/" + order.order_id}
              key={i}
              className="p-5 bg-white"
            >
              <div>
                <p className="text-xs">{order.order_code}</p>
              </div>

              <div className="text-sm mt-5 p-5 bg-slate-100">
                <p className="font-medium uppercase">
                  {order.order_status.replace("_", " ")}{" "}
                </p>
                <p>
                  Payment Status{" "}
                  <span className="font-medium">
                    {order.invoice.payment_status}
                  </span>
                </p>
              </div>

              <div className="mt-2 text-sm p-5 bg-slate-100">
                <p>{order.invoice.customer_full_name}</p>
                <p className="text-sm">
                  {order.invoice.invoice_item.length} items
                </p>
              </div>

              <div className="mt-5 text-xs">
                <p>{order.invoice.payment_date}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>Order masih kosong</p>
      )}
    </div>
  );
}
