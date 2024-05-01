"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardVoucherPage() {
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    async function getVouchers() {
      const res = await fetch("/api/vouchers").then((r) => r.json());
      setVouchers(res.data.vouchers);
    }
    getVouchers();
  }, []);

  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto px-8">
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
              <div key={i} className="px-5 py-2 bg-cyan-400 text-white">
                <h1 className="font-bold text-xl">{voucher}</h1>
                <p>
                  {voucher.is_percent_value
                    ? `${voucher.discount_value}% OFF`
                    : `-Rp${voucher.discount_value}`}
                </p>
                <p>
                  Maximum Discount Amount: {voucher.maximum_discount_amount}
                </p>
                <p>{voucher.is_limited && "LIMITED"}</p>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
