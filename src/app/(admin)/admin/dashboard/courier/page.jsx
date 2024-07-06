"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCookies } from "next-client-cookies";

export default function AdminDashboardCourierPage() {
  const cookie = useCookies();

  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getCouriers() {
      const res = await fetch("/api/couriers?available=true").then((r) =>
        r.json()
      );
      setCouriers(res.data.courier_companies);
    }
    getCouriers();
  }, []);

  async function handleDeleteCourier(courier_code, courier_service_code) {
    setLoading(courier_code + "::" + courier_service_code);
    const res = await fetch("/api/couriers", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + cookie.get("access_token"),
      },
      body: JSON.stringify({
        courier_code: courier_code,
        courier_service_code: courier_service_code,
      }),
    }).then((r) => r.json());
    setLoading("");

    if (res.status == "fail") {
      setError(res.message);
      return;
    }

    window.location.reload();
  }

  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto px-8 min-h-dvh">
        <Link
          href={"/admin/dashboard/courier/new"}
          className="px-5 py-2 bg-cyan-400 text-white block w-max mb-5"
        >
          Activate new Courier
        </Link>
        <h1>{couriers.length} total active courier</h1>
        <hr className="border-2 border-cyan-700" />
        {error && (
          <div className="px-5 py-2 bg-red-200 border-l-4 border-l-red-400 mb-5">
            Error: {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
          {couriers.map((courier, i) => (
            <>
              <div key={i} className="px-5 py-2 bg-cyan-400 text-white">
                <h1 className="text-xl font-bold">
                  {courier.courier_name}{" "}
                  <span className="font-medium text-sm">
                    {courier.courier_service_name}
                  </span>
                </h1>
                <p>{courier.description}</p>
                <p>
                  {courier.shipment_duration_range}{" "}
                  {courier.shipment_duration_unit}
                </p>
                <button
                  className="bg-red-400 px-5 py-1 w-full my-2"
                  onClick={() =>
                    handleDeleteCourier(
                      courier.courier_code,
                      courier.courier_service_code
                    )
                  }
                >
                  {loading ==
                  `${
                    courier.courier_code + "::" + courier.courier_service_code
                  }`
                    ? "Loading..."
                    : "Delete"}
                </button>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
