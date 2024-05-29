"use client";

import { useCookies } from "next-client-cookies";
import { useState } from "react";

export default function MarkAsDoneScreen({ orderId }) {
  const cookie = useCookies();

  const [loading, setLoading] = useState(false);

  async function handleMarkAsDone() {
    setLoading(true);
    const res = await fetch("/api/myshop_orders/" + orderId + "/completed", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + cookie.get("access_token"),
      },
      body: JSON.stringify({
        new_status: "COMPLETED",
      }),
    }).then((r) => r.json());

    setLoading(false);

    if (res.status == "success") {
      window.location.replace("/admin/dashboard/order?filter=done");
    }
  }
  return (
    <div className="mt-5">
      <button
        onClick={handleMarkAsDone}
        className="px-5 py-2 bg-cyan-400 text-white w-full"
      >
        {loading ? "Loading..." : "Mark As Done"}
      </button>
      <p className="text-xs">
        *Warning: Dengan mengklik tombol diatas, maka pesanan dianggap telah
        selesai dan sampai ke lokasi penerima.
      </p>
    </div>
  );
}
