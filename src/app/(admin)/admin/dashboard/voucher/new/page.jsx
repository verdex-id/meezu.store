"use client";

import { useState } from "react";

export default function AdminDashboardVoucherPage() {
  const [isPercentDiscount, setIsPercentDiscount] = useState(false);
  const [isLimitedDiscount, setIsLimitedDiscount] = useState(false);
  const [isThresholdDiscount, setIsThresholdDiscount] = useState(false);
  const [isLimitedTimeDiscount, setIsLimitedTimeDiscount] = useState(false);
  const [isDailyDiscount, setIsDailyDiscount] = useState(false);

  async function handleAddVoucher() {
    const payload = {
      discount_code: "kojo",
      is_percent_discount: false,
      discount_value: 50000,
      maximum_discount_amount: 100000,

      is_limited_discount: true,
      discount_usage_limits: 5,

      is_threshold_discount: true,
      discount_minimum_amount: 50000,

      is_limited_time_discount: true,
      from_date: new Date(),
      to_date: new Date(),

      is_daily_discount: true,
      from_hour: 0,
      to_hour: 23,
    };
  }
  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto px-8 min-h-dvh pb-96">
        <form
          method="post"
          className="p-5 mt-5 bg-white w-full max-w-screen-sm mx-auto"
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
                    type="date"
                    name="from_date"
                    className="px-5 py-2 bg-white outline-none border-2 border-cyan-200 w-full"
                    required
                  />
                </div>
                <div>
                  <h1>To Date</h1>
                  <input
                    type="date"
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

          <div className="mt-8">
            <button className="px-5 py-2 bg-cyan-400 text-white w-full">
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
