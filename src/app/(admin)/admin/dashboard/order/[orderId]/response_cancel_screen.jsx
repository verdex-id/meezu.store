"use client";

import { useCookies } from "next-client-cookies";
import { useState } from "react";

export default function AcceptCancelScreen({ order }) {
  const cookie = useCookies();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleAccept() {
    setLoading(true);
    setSuccess(false);
    setError("");

    const res = await fetch("/api/myshop_orders/" + order.order_id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.get("access_token"),
      },
      body: JSON.stringify({
        new_status: "AWAITING_REFUND",
      }),
    }).then((r) => r.json());

    setLoading(false);

    if (res.status == "success") {
      setSuccess(true);
    } else {
      setSuccess(false);
      setError(res.message);
    }
  }

  async function handleDeny() {
    setLoading(true);
    setSuccess(false);
    setError("");

    const res = await fetch("/api/myshop_orders/" + order.order_id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.get("access_token"),
      },
      body: JSON.stringify({
        new_status: "AWAITING_FULFILLMENT",
      }),
    }).then((r) => r.json());

    setLoading(false);

    if (res.status == "success") {
      setSuccess(true);
    } else {
      setSuccess(false);
      setError(res.message);
    }
  }

  return (
    <div className="mt-5 flex gap-2">
      {success && (
        <div className="px-5 py-2 bg-white border-l-4 border-green-400 my-2">
          Success
        </div>
      )}

      {error && (
        <div className="px-5 py-2 bg-white border-l-4 border-red-400 my-2">
          Error: {error}
        </div>
      )}
      <button
        onClick={handleAccept}
        className="px-5 py-2 bg-green-400 text-white w-full"
      >
        {loading ? "Loading..." : "Accept"}
      </button>
      <button
        onClick={handleDeny}
        className="px-5 py-2 bg-red-400 text-white w-full"
      >
        {loading ? "Loading..." : "Deny"}
      </button>
    </div>
  );
}
