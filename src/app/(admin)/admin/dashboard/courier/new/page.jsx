"use client";

import { useCookies } from "next-client-cookies";
import { useEffect, useState } from "react";

export default function AdminDashboardCourierNewPage() {
  const cookie = useCookies();

  const [couriers, setCouriers] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getBiteshipCouriers() {
      const res = await fetch("/api/couriers?available=false").then((r) =>
        r.json()
      );
      setCouriers(res.data.courier_companies);
    }
    getBiteshipCouriers();
  }, []);

  async function handleAddCourier(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = formData.get("courier").split("::");
    const courier_code = data[0];
    const courier_service_code = data[1];

    const res = await fetch("/api/couriers/create", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + cookie.get("access_token"),
      },
      body: JSON.stringify({
        courier_code: courier_code,
        courier_service_code: courier_service_code,
      }),
    }).then((r) => r.json());
    setLoading(false);

    if (res.status == "fail") {
      setError("Kurir sudah aktif");
      return;
    }
    setSuccess(true);
  }
  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto px-8 min-h-dvh">
        <h1 className="font-bold text-xl text-center">Activate new Courier</h1>
        <form
          className="space-y-2 mb-10 max-w-sm mx-auto my-5"
          onSubmit={handleAddCourier}
        >
          {success && (
            <div className="px-5 py-2 bg-green-200 border-l-4 border-l-green-400 mb-5">
              Success!
            </div>
          )}
          {error && (
            <div className="px-5 py-2 bg-red-200 border-l-4 border-l-red-400 mb-5">
              Error: {error}
            </div>
          )}
          <select
            name="courier"
            className="w-full px-5 py-2 bg-white border-2 border-cyan-400"
          >
            {couriers.map((courier, i) => (
              <option
                key={i}
                value={`${courier.courier_code}::${courier.courier_service_code}`}
              >{`${courier.courier_name} - ${courier.courier_service_name}`}</option>
            ))}
          </select>
          <button
            className={`px-5 py-2 bg-cyan-400 text-white w-full text-center border-2 border-cyan-500 ${
              loading && "animate-pulse"
            }`}
          >
            {loading ? "Loading..." : "Activate"}
          </button>
        </form>
      </div>
    </>
  );
}
