"use client";

import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useState } from "react";

export default function AdminVoucherScreen({ vouchers }) {
  const cookie = useCookies();

  console.log(vouchers);

  const [loading, setLoading] = useState(false);

  async function handleDelete(voucherId) {
    setLoading(true);
    const res = await fetch("/api/discounts/" + voucherId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.get("access_token"),
      },
    });

    setLoading(false);

    if (res.status == "success") {
      window.location.reload();
    }
  }
  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto px-8 min-h-dvh">
        <Link
          href={"/admin/dashboard/voucher/new"}
          className="px-5 py-2 bg-cyan-400 text-white block w-max"
        >
          Add new Voucher
        </Link>
        <h1 className="mt-5">{vouchers.length} total vouchers</h1>
        <hr className="border-2 border-cyan-700" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
          {vouchers.map((voucher, i) => (
            <>
              <div key={i} className="p-5 bg-cyan-400 text-white text-center">
                <h1 className="font-bold text-3xl p-2 border-2 border-white border-dashed font-mono uppercase">
                  {voucher.discount_code}
                </h1>
                <p className="mt-2">
                  {voucher.is_percent_discount
                    ? `${voucher.discount_value}% OFF`
                    : `-Rp${voucher.discount_value}`}
                </p>
                <p className="text-sm">
                  Max Discount Amount: Rp
                  {Intl.NumberFormat("id-ID").format(
                    voucher.maximum_discount_amount
                  )}
                </p>
                <p className="text-xs">
                  Minimun Amount: Rp
                  {Intl.NumberFormat("id-ID").format(
                    voucher.threshold_discount?.minimum_amount || 0
                  )}
                </p>
                {voucher.is_limited && (
                  <div className="px-2 bg-cyan-500 text-white font-bold w-max mx-auto mt-2">
                    <p>
                      LIMITED{" "}
                      <span className="font-normal text-sm">
                        {voucher.usage_limits} uses
                      </span>
                    </p>
                  </div>
                )}
                <p className="text-sm">{voucher.number_of_uses}x Usage</p>

                {voucher.limited_time_discount && (
                  <div className="px-2 text-white mt-5">
                    <p className="text-xs">
                      Valid from{" "}
                      {new Date(
                        voucher.limited_time_discount.from_date
                      ).toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs">
                      Valid until{" "}
                      {new Date(
                        voucher.limited_time_discount.to_date
                      ).toLocaleString("id-ID")}
                    </p>
                  </div>
                )}

                {voucher.daily_discount && (
                  <div className="px-2 text-white mt-5">
                    <p className="text-xs">
                      Active on{" "}
                      <span>{voucher.daily_discount.from_hour}:00 WIB</span>
                      <span> to </span>
                      <span>{voucher.daily_discount.to_hour}:00 WIB</span>
                    </p>
                  </div>
                )}

                <button
                  onClick={() => handleDelete(voucher.discount_id)}
                  className="bg-red-400 text-white px-5 mt-5"
                >
                  {loading ? "Loading..." : "Delete"}
                </button>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
