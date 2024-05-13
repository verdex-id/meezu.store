"use client";

import { useCookies } from "next-client-cookies";
import { useState } from "react";

export default function ShipScreen({ order }) {
  const cookie = useCookies();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  let date = new Date();
  date.setMinutes(date.getMinutes() + 5);

  async function handleShip() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/shipments/guest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.get("access_token"),
      },
      body: JSON.stringify({
        order_id: order.order_id,
        note_for_courier: order.guest_order.guest_note_for_courier,
        is_need_insurance: false,
        delivery_type: "now",
        delivery_date: date.toISOString(),
        order_note: "-",
      }),
    }).then((r) => r.json());

    setLoading(false);

    if (res.status == "success") {
      window.location.replace("/admin/dashboard/order?filter=confirm_shipping");
    } else {
      console.log(res);
      setError(
        "Gagal mengirim permintaan Pick-Up. Silahkan datang ke pihak ekspedisi untuk menyerahkan paket."
      );
    }
  }
  return (
    <div className="mt-5">
      {error && (
        <div className="my-5 border-l-4 border-red-400 bg-white px-5 py-2">
          Error: {error}
        </div>
      )}
      <button
        onClick={handleShip}
        className="px-5 py-2 bg-cyan-400 text-white w-full"
      >
        {loading ? "Loading..." : "Kirim"}
      </button>
      <p className="text-xs">
        *Warning: Dengan mengklik tombol diatas, maka pesanan akan menunggu
        pickup dari pihak Jasa Kirim.
      </p>
    </div>
  );
}
