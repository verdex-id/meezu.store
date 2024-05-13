"use client";

import { useCookies } from "next-client-cookies";
import { useState } from "react";

export default function AdminDashboardVoucherPage() {
  const cookie = useCookies();

  const [isPercentDiscount, setIsPercentDiscount] = useState(false);
  const [isLimitedDiscount, setIsLimitedDiscount] = useState(false);
  const [isThresholdDiscount, setIsThresholdDiscount] = useState(false);
  const [isLimitedTimeDiscount, setIsLimitedTimeDiscount] = useState(false);
  const [isDailyDiscount, setIsDailyDiscount] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleAddVoucher(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    const formData = new FormData(e.currentTarget);

    const payload = {
      discount_code: formData.get("discount_code"),
      is_percent_discount: isPercentDiscount || false,
      discount_value: Number(formData.get("discount_value")),
      maximum_discount_amount:
        Number(formData.get("maximum_discount_amount")) || undefined,

      is_limited_discount: isLimitedDiscount || false,
      discount_usage_limits:
        Number(formData.get("discount_usage_limits")) || undefined,

      is_threshold_discount: isThresholdDiscount || false,
      discount_minimum_amount:
        Number(formData.get("discount_minimum_amount")) || undefined,

      is_limited_time_discount: isLimitedTimeDiscount || false,
      from_date: formData.get("from_date")
        ? new Date(formData.get("from_date")).toISOString() || undefined
        : undefined,
      to_date: formData.get("to_date")
        ? new Date(formData.get("to_date")).toISOString() || undefined
        : undefined,

      is_daily_discount: isDailyDiscount || false,
      from_hour: Number(formData.get("from_hour")) || undefined,
      to_hour: Number(formData.get("to_hour")) || undefined,
    };

    const res = await fetch("/api/discounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + cookie.get("access_token"),
      },
      body: JSON.stringify(payload),
    }).then((r) => r.json());

    setLoading(false);

    if (res.status == "success") {
      setSuccess(true);
    } else if (res.status == "fail") {
      setSuccess(false);
      setError(res.message);
    }
  }
  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto px-8 min-h-dvh pb-96">
        <form
          method="post"
          className="p-5 mt-5 bg-white w-full max-w-screen-sm mx-auto"
          onSubmit={handleAddVoucher}
        >
          <h1 className="font-bold text-xl text-center">Add New Voucher</h1>

          <div className="mt-5">
            <h1>Discount Code</h1>
            <input
              type="text"
              name="discount_code"
              placeholder="MERCH4"
              className="px-5 py-2 bg-white outline-none border-2 border-cyan-200 w-full"
              required
              minLength={3}
              maxLength={35}
            />
          </div>
          <div className="mt-5">
            <h1>Bentuk Diskon</h1>
            <select
              name="is_percent_discount"
              className="px-5 py-2 bg-white outline-none border-2 border-cyan-200 w-full"
            >
              <option value="false" onClick={() => setIsPercentDiscount(false)}>
                Nominal (Cth: Potongan Rp10.000)
              </option>
              <option value="true" onClick={() => setIsPercentDiscount(true)}>
                Percent (Cth: 5% OFF)
              </option>
            </select>
          </div>

          <div className="mt-5">
            <h1>Discount Value</h1>
            {isPercentDiscount ? (
              <input
                type="number"
                name="discount_value"
                placeholder="5 (Diskon 5%)"
                className="px-5 py-2 bg-white outline-none border-2 border-cyan-200 w-full"
                required
                min={1}
                max={100}
              />
            ) : (
              <input
                type="number"
                name="discount_value"
                placeholder="20000 (Potongan Rp20.000)"
                className="px-5 py-2 bg-white outline-none border-2 border-cyan-200 w-full"
                required
                min={500}
                max={16500000}
              />
            )}
          </div>

          <div className="mt-5">
            <h1>Max Discount Amount</h1>
            <input
              type="number"
              name="maximum_discount_amount"
              placeholder="100000 (Max Rp100.000)"
              className="px-5 py-2 bg-white outline-none border-2 border-cyan-200 w-full"
              required
              min={500}
              max={16500000}
            />
          </div>

          <div className="mt-5">
            <h1>Limited Discount?</h1>
            <select
              name="is_limited_discount"
              className="px-5 py-2 bg-white outline-none border-2 border-cyan-200 w-full"
            >
              <option value="false" onClick={() => setIsLimitedDiscount(false)}>
                Unlimited
              </option>
              <option value="true" onClick={() => setIsLimitedDiscount(true)}>
                Limited
              </option>
            </select>
          </div>

          {isLimitedDiscount && (
            <div className="mt-5">
              <h1>Max Discount Usage Limit</h1>
              <input
                type="number"
                name="discount_usage_limits"
                placeholder="10 (Max 10x penggunaan)"
                className="px-5 py-2 bg-white outline-none border-2 border-cyan-200 w-full"
                required
                min={1}
                max={16500000}
              />
            </div>
          )}

          <div className="mt-5">
            <h1>Ada Minimal Biaya Pembelian?</h1>
            <select
              name="is_threshold_discount"
              className="px-5 py-2 bg-white outline-none border-2 border-cyan-200 w-full"
            >
              <option
                value="false"
                onClick={() => setIsThresholdDiscount(false)}
              >
                No
              </option>
              <option value="true" onClick={() => setIsThresholdDiscount(true)}>
                Yes
              </option>
            </select>
          </div>

          {isThresholdDiscount && (
            <div className="mt-5">
              <h1>Minimal Pembelian</h1>
              <p className="text-xs">
                Cth: Minimal pembelian Rp100.000 untuk bisa menggunakan voucher
                ini.
              </p>
              <input
                type="number"
                name="discount_minimum_amount"
                placeholder="100000"
                className="px-5 py-2 bg-white outline-none border-2 border-cyan-200 w-full"
                required
                min={500}
                max={16500000}
              />
            </div>
          )}

          <div className="mt-5">
            <h1>Ada Batas Tanggal?</h1>
            <select
              name="is_limited_time_discount"
              className="px-5 py-2 bg-white outline-none border-2 border-cyan-200 w-full"
            >
              <option
                value="false"
                onClick={() => setIsLimitedTimeDiscount(false)}
              >
                No
              </option>
              <option
                value="true"
                onClick={() => setIsLimitedTimeDiscount(true)}
              >
                Yes
              </option>
            </select>
          </div>
          {isLimitedTimeDiscount && (
            <div className="mt-5">
              <h1>Batas Tanggal</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
                <div>
                  <h1>From Date</h1>
                  <input
                    type="datetime-local"
                    name="from_date"
                    className="px-5 py-2 bg-white outline-none border-2 border-cyan-200 w-full"
                    required
                  />
                </div>
                <div>
                  <h1>To Date</h1>
                  <input
                    type="datetime-local"
                    name="to_date"
                    className="px-5 py-2 bg-white outline-none border-2 border-cyan-200 w-full"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-5">
            <h1>Ada Batas Jam?</h1>
            <select
              name="is_limited_time_discount"
              className="px-5 py-2 bg-white outline-none border-2 border-cyan-200 w-full"
            >
              <option value="false" onClick={() => setIsDailyDiscount(false)}>
                No
              </option>
              <option value="true" onClick={() => setIsDailyDiscount(true)}>
                Yes
              </option>
            </select>
          </div>

          {isDailyDiscount && (
            <div className="mt-5">
              <h1>Batas Jam</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
                <div>
                  <h1>From Hour</h1>
                  <input
                    type="number"
                    name="from_hour"
                    className="px-5 py-2 bg-white outline-none border-2 border-cyan-200 w-full"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <h1>To Hour</h1>
                  <input
                    type="number"
                    name="to_hour"
                    className="px-5 py-2 bg-white outline-none border-2 border-cyan-200 w-full"
                    placeholder="23"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mt-8 border-l-4 border-green-400 bg-white p-5">
              Success! Voucher discount berhasil dibuat
            </div>
          )}

          {error && (
            <div className="mt-8 border-l-4 border-red-400 bg-white p-5">
              Error! {error}
            </div>
          )}

          <div className="mt-8">
            <button className="px-5 py-2 bg-cyan-400 text-white w-full">
              {loading ? "Loading..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
