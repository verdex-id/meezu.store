"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartIcon from "@/icons/cart";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      const cart = JSON.parse(localStorage.getItem("cart"));
      try {
        setCartCount(Object.keys(cart).length);
      } catch (err) {}
    }, 3000);
  });
  return (
    <>
      <div className="flex justify-between items-center w-full max-w-screen-xl p-5 mx-auto border-b-4 border-white font-baloo">
        <div>
          <Link href={"/"}>
            <Image src={"/logo/logo_meezu.png"} width={64} height={64} />
          </Link>
        </div>
        <div className="flex items-center justify-between text-cyan-900 gap-8">
          <Link
            href={"/"}
            className={`${
              pathname == "/" ? "text-cyan-900 font-bold" : "text-cyan-900/70"
            }`}
          >
            Beranda
          </Link>
          <Link
            href={"/merch"}
            className={`${
              pathname == "/merch"
                ? "text-cyan-900 font-bold"
                : "text-cyan-900/70"
            }`}
          >
            Merchandise
          </Link>
          <Link href={"/cart"} className="relative">
            <CartIcon className="w-6" />
            {cartCount > 0 && (
              <div className="w-5 h-5 text-white bg-red-500 rounded-full absolute -right-2 -top-2">
                <p className="text-center text-sm">{cartCount}</p>
              </div>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}
