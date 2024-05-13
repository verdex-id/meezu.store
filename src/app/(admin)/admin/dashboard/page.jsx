"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminDashboardPage() {
  const [menus, setMenus] = useState([
    "product",
    "order",
    "banner",
    "voucher",
    "courier",
    "address",
  ]);
  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto px-8 min-h-dvh">
        <h1 className="font-bold text-xl">Admin Dashboard</h1>
        <p>Hi, disini anda dapat mengatur beberapa menu dibawah ini.</p>
        <div className="grid grid-cols-2 sm:grid-grid-cols-3 md:grid-cols-4 gap-4 my-5 p-5 bg-white">
          {menus.map((menu, i) => (
            <>
              <Link
                key={i}
                href={`/admin/dashboard/${menu}`}
                className="p-5 bg-cyan-400 text-white"
              >
                <h1 className="font-bold text-sm md:text-lg lg:text-xl text-center uppercase">
                  {menu}
                </h1>
              </Link>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
