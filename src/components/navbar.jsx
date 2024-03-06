"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "./button";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <>
      <div className="flex justify-between items-center w-full max-w-screen-xl p-5 mx-auto border-b-4 border-white">
        <div>
          <Link href={"/"}>
            <Image src={"/logo/akudav.png"} width={100} height={100} />
          </Link>
        </div>
        <div className="flex items-center justify-between text-white gap-8">
          <Link
            href={"/"}
            className={`${
              pathname == "/" ? "text-white font-bold" : "text-white/70"
            }`}
          >
            Home
          </Link>
          <Link
            href={"/merch"}
            className={`${
              pathname == "/merch" ? "text-white font-bold" : "text-white/70"
            }`}
          >
            Merch
          </Link>
          <Button type={1}>Sign In</Button>
        </div>
      </div>
    </>
  );
}
