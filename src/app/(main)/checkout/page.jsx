"use client";

import Input from "@/components/input";
import Select from "@/components/select";
import React, { useEffect, useState } from "react";
import Button from "@/components/button";
import Image from "next/image";

export default function CheckoutPage() {
  const [paymentOptions, setPaymentOptions] = useState([]);

  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleClick = (paymentId) => {
    setSelectedPayment(paymentId);
    console.log(`Payment option ${paymentId} clicked`);
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
                  title={"email"}
                  placeholder={"email"}
                />
              </div>
              <div className="mt-8">
                <Input
                  type={"text"}
                  id={"confirmEmail"}
                  name={"confirmEmail"}
                  title={"Konfirmasi Email"}
                  placeholder={"Konfirmasi Email"}
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
                  title={"name"}
                  placeholder={"name"}
                />
              </div>

              <div className="mt-8">
                {/* input Nomor Telepon */}
                <Input
                  type={"text"}
                  id={"nomor"}
                  name={"nomor"}
                  title={"nomor"}
                  placeholder={"nomor"}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 border-y-4">
            {/* select Provinsi */}
            <div className="w-full mt-8  ">
              <Select title={"Provinsi"}>
                <option value="kalbar">Kalimantan Barat</option>
                <option value="kalteng">Kalimantan Tengah</option>
                <option value="kaltim">Kalimantan Timur</option>
              </Select>
            </div>
            {/* select Kota */}
            <div className="w-full mt-8">
              <Select title={"Kota"}>
                <option value="kalbar">Pontianak</option>
                <option value="kalteng">Singkawang</option>
                <option value="kaltim">Sintang</option>
              </Select>
            </div>
            {/* select Kecamatan */}
            <div className="w-full mt-8">
              <Select title={"Kota"}>
                <option value="kalbar">Pontianak Barat</option>
                <option value="kalteng">Pontianak Selatan</option>
                <option value="kaltim">Pontianak Kota</option>
              </Select>
            </div>
            <div className="mt-8">
              {/* Kode Pos */}
              <Input
                type={"text"}
                id={"kodePos"}
                name={"kodePos"}
                title={"Kode Pos"}
                placeholder={"kode Pos"}
              />
            </div>
            <div className="mb-8 mt-8">
              <Input
                type={"textarea"}
                id={"detail"}
                name={"detail"}
                title={"Detail"}
                placeholder="Detail Pesanan jika diperlukan"
              />
            </div>
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
