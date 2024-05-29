"use client";

import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarAdmin() {
  const cookie = useCookies();
  const pathname = usePathname();
  return (
    <>
      {!pathname.includes("/admin/login") && (
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

            <button
              onClick={() => {
                cookie.remove("access_token");
                cookie.remove("refresh_token");
                window.location.replace("/admin/login");
              }}
              className={`${
                pathname == "/admin/dashboard/logout"
                  ? "text-cyan-900 font-bold"
                  : "text-cyan-900/70"
              }`}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
