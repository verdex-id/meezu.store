"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarAdmin() {
  const pathname = usePathname();
  return (
    <>
      <div className="h-[150px] flex justify-center items-center w-full max-w-screen-xl p-5 mx-auto font-baloo">
        <div className="flex items-center justify-between text-cyan-900 gap-12 text-xl">
          <Link
            href={"/admin/dashboard"}
            className={`${
              pathname == "/admin/dashboard"
                ? "text-cyan-900 font-bold"
                : "text-cyan-900/70"
            }`}
          >
            Main Menu
          </Link>

          <Link
            href={"/admin/dashboard/order"}
            className={`${
              pathname == "/admin/dashboard/order"
                ? "text-cyan-900 font-bold"
                : "text-cyan-900/70"
            }`}
          >
            Orders
          </Link>

          <Link
            href={"/admin/dashboard/logout"}
            className={`${
              pathname == "/admin/dashboard/logout"
                ? "text-cyan-900 font-bold"
                : "text-cyan-900/70"
            }`}
          >
            Logout
          </Link>
        </div>
      </div>
    </>
  );
}
