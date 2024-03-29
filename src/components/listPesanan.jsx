import Link from "next/link";
import Image from "next/image";
import AccountCircleIcon from "@/icons/account_circle";
import CalendarMonthIcon from "@/icons/calendar_month";
import ContactsProductIcon from "@/icons/contacts_product";
import LocationOnIcon from "@/icons/location_on";

export default function ListPesanan({
  nama,
  no_hp,
  tanggal_pesan,
  alamat,
  gambar_produk,
  nama_produk,
}) {
  return (
    <>
      <div className="w-full mx-auto mt-5">
        <div className="text-black bg-white p-8">
          <h1 className="font-semibold text-xl">Order #CFHAS125129</h1>
          <div className="flex gap-2 items-center">
            <div>
              <Link href={"/"}>
                <AccountCircleIcon />
              </Link>
            </div>
            <p>{nama}</p>
          </div>

          <div className="flex gap-2 items-center mt-3">
            <div>
              <Link href={"/"}>
                <ContactsProductIcon />
              </Link>
            </div>
            <p>{no_hp}</p>
          </div>

          <div className="flex gap-2 items-center mt-3">
            <div>
              <Link href={"/"}>
                <CalendarMonthIcon />
              </Link>
            </div>
            <p>{tanggal_pesan}</p>
          </div>

          <div className="flex gap-2 items-center mt-3">
            <div>
              <Link href={"/"}>
                <LocationOnIcon />
              </Link>
            </div>
            <p>{alamat}</p>
          </div>

          <div className="flex gap-2 items-center mt-3">
            <div>
              <div className="bg-cyan-300 w-10 h-10" {...gambar_produk}></div>
            </div>
            <p>{nama_produk}</p>
          </div>
        </div>
      </div>
    </>
  );
}
