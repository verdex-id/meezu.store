"use client";

import Input from "@/components/input";
import Select from "@/components/select";
import React, { useEffect, useState } from "react";
import Button from "@/components/button";
import Image from "next/image";

export default function CheckoutPage() {
  const [paymentOptions, setPaymentOptions] = useState([]);

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [areasSearchText, setAreasSearchText] = useState("");
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState();
  const [addressNotes, setAddressNotes] = useState("");

  const [sellerNotes, setSellerNotes] = useState("");

  const handleClick = (paymentId) => {
    setSelectedPayment(paymentId);
  };

  useEffect(() => {
    async function getPaymentOptions() {
      const res = await fetch("/api/payment/channels");
      const response = await res.json();
      console.log(response.data);
      setPaymentOptions(response.data);
    }
    getPaymentOptions();
  }, []);

  async function handleSearchAddress() {
    const res = await fetch(`/api/areas?input=${areasSearchText}`).then((r) =>
      r.json()
    );
    if (res.status == "success") {
      setAreas(res.data.areas);
    }
  }

  return (
    <>
      <div className="min-h-dvh w-full max-w-screen-xl mx-auto px-8 text-cyan-900">
        <div className="mt-5">
          <div className="mt-8">
            <div className="mt-8 ">
              <div>
                <Input
                  type={"text"}
                  id={"email"}
                  name={"email"}
                  title={"Email"}
                  placeholder={"email@gmail.com"}
                />
              </div>
              <div className="mt-8">
                <Input
                  type={"text"}
                  id={"confirmEmail"}
                  name={"confirmEmail"}
                  title={"Konfirmasi Email"}
                  placeholder={"email@gmail.com"}
                />
              </div>
            </div>
            <div className="mt-8 border-y-4">
              <div className=" mt-8">
                {/* input Nama */}
                <Input
                  type={"text"}
                  id={"name"}
                  name={"name"}
                  title={"Name"}
                  placeholder={"Nama Lengkap"}
                />
              </div>

              <div className="mt-8">
                {/* input Nomor Telepon */}
                <Input
                  type={"text"}
                  id={"phone"}
                  name={"phone"}
                  title={"Nomor HP"}
                  placeholder={"08123456789"}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 border-y-4">
            <Input
              type={"textarea"}
              title={"Catatan untuk Penjual"}
              placeholder="Catatan untuk penjual, jika ada"
              onChange={(e) => setSellerNotes(e.target.value)}
            />
          </div>

          <div className="mt-8 border-y-4">
            {/* Search Address */}
            <div className="w-full mt-8">
              <h1 className="font-bold font-fredoka text-2xl">Cari Alamat</h1>
              <div className="flex gap-2 mb-2">
                <input
                  type={"text"}
                  placeholder="Masukkan kata kunci untuk mencari alamat pengiriman"
                  onChange={(e) => setAreasSearchText(e.target.value)}
                  className="w-full px-5 py-3 outline-none"
                />
                <div
                  className="px-5 py-3 bg-cyan-400 text-white cursor-pointer"
                  onClick={() => handleSearchAddress()}
                >
                  Search
                </div>
              </div>

              {areas.length > 0 && (
                <>
                  <Select title={"Pilih Alamat"}>
                    {areas.map((area, i) => (
                      <option
                        key={i}
                        value={area.id}
                        onClick={() => setSelectedArea(area)}
                      >
                        {area.name}
                      </option>
                    ))}
                  </Select>

                  <div>
                    <Input
                      type={"textarea"}
                      title={"Catatan Alamat"}
                      placeholder="Contoh: RT/RW, Patokan, Warna Rumah, dll"
                      onChange={(e) => setAddressNotes(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            {selectedArea && (
              <div className="p-5 bg-white mt-8">
                <h1 className="font-bold text-xl">
                  Konfirmasi Alamat Pengiriman
                </h1>
                <h1>{selectedArea.name}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  <div>
                    <h1 className="font-bold first-letter:uppercase">
                      {selectedArea.administrative_division_level_1_type}
                    </h1>
                    <h2>{selectedArea.administrative_division_level_1_name}</h2>
                  </div>
                  <div>
                    <h1 className="font-bold first-letter:uppercase">
                      {selectedArea.administrative_division_level_2_type}
                    </h1>
                    <h2>{selectedArea.administrative_division_level_2_name}</h2>
                  </div>
                  <div>
                    <h1 className="font-bold first-letter:uppercase">
                      {selectedArea.administrative_division_level_3_type}
                    </h1>
                    <h2>{selectedArea.administrative_division_level_3_name}</h2>
                  </div>
                  <div>
                    <h1 className="font-bold first-letter:uppercase">
                      Postal Code
                    </h1>
                    <h2>{selectedArea.postal_code}</h2>
                  </div>
                </div>
                <h1 className="font-bold">Catatan Alamat</h1>
                <p className="bg-slate-100 p-2">{addressNotes}</p>
              </div>
            )}
          </div>
          {/* Subtotal Item */}
          <div className=""></div>
          {/* Opsi Pembayaran */}
          <div className="mt-8 mb-8 ">
            <h1 className="font-bold text-3xl text-cyan-900 mt-8">
              Metode Pembayaran
            </h1>
            <div className="flex flex-wrap gap-4 mt-4  ">
              {paymentOptions.map((payment) => (
                <button
                  key={payment.code}
                  className={`p-5 bg-white text-cyan-900 ${
                    selectedPayment === payment.code ? "bg-cyan-300" : ""
                  }`}
                  onClick={() => handleClick(payment.code)}
                >
                  <Image
                    src={payment.icon_url}
                    width={1080}
                    height={1080}
                    className="w-[120px] aspect-[3/1] object-contain"
                  />
                  {/* {payment.name} */}
                </button>
              ))}
            </div>
            <div className="flex justify-end border-y-4 mt-8 p-8">
              <div className="">
                <Button type={2}>CHECKOUT !</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
