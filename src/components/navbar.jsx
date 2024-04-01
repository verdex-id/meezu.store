"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "./button";
import { usePathname } from "next/navigation";
import CartIcon from "@/icons/cart";

export default function Navbar() {
  const pathname = usePathname();
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
          <Link href={"/cart"}>
            <CartIcon className="w-6" />
          </Link>
        </div>
      </div>
    </>
  );
}
