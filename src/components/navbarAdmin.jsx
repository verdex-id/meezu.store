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
                        className={`${pathname == "/" ? "text-cyan-900 font-bold" : "text-cyan-900/70"}`}
                    >Produk</Link>

                    <Link 
                        href={"/admin/dashboard/banner"}
                        className={`${pathname == "/" ? "text-cyan-900 font-bold" : "text-cyan-900/70"}`}
                    >Banner</Link>

                    <Link
                        href={"/admin/dashboard/listPesanan"}
                        className={`${pathname == "/" ? "text-cyan-900 font-bold" : "text-cyan-900/70"}`}
                    >List Pesanan</Link>

                    <Link 
                        href={"/admin/dashboard/links"}
                        className={`${pathname == "/" ? "text-cyan-900 font-bold" : "text-cyan-900/70"}`}
                    >Links</Link>
                </div>
            </div>
        </>
    )
}