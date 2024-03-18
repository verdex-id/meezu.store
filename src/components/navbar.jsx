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
            <Image src={"/logo/akudav.png"} width={100} height={100} />
          </Link>
        </div>
        <div className="flex items-center justify-between text-cyan-900 gap-8">
          <Link
            href={"/"}
            className={`${
              pathname == "/" ? "text-cyan-900 font-bold" : "text-cyan-900/70"
            }`}
          >
            Home
          </Link>
          <Link
            href={"/merch"}
            className={`${
              pathname == "/merch"
                ? "text-cyan-900 font-bold"
                : "text-cyan-900/70"
            }`}
          >
            Merch
          </Link>
          <button>
            <CartIcon className="w-6" />
          </button>
        </div>
      </div>
    </>
  );
}
