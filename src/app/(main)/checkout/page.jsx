"use client";

import Input from "@/components/input";
import Select from "@/components/select";
import React, { useEffect, useState } from "react";
import Button from "@/components/button";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const [paymentOptions, setPaymentOptions] = useState([]);

  const [selectedPayment, setSelectedPayment] = useState();

  const [areasSearchText, setAreasSearchText] = useState("");
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState();
  const [addressNotes, setAddressNotes] = useState("");

  const [cart, setCart] = useState();
  const [cartItems, setCartItems] = useState([]);

  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sellerNotes, setSellerNotes] = useState("");

  useEffect(() => {
    const cartLocal = JSON.parse(localStorage.getItem("cart"));
    setCart(cartLocal);

    async function getCartItems() {
      const ids = [];
      for (const id in cartLocal) {
        ids.push(id);
      }

      const res = await fetch(`/api/product_iterations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: ids,
        }),
      }).then((r) => r.json());

      if (res.status == "success") {
        setCartItems(res.data.products);
      }
    }
    getCartItems();
  }, []);

  useEffect(() => {
    let cartTotal = 0;
    for (let product of cartItems) {
      cartTotal +=
        product.product_variant_price * cart[product.product_iteration_id].qty;
    }
    setCartSubtotal(cartTotal);
  }, [cart, cartItems]);

  useEffect(() => {
    setSubtotal((selectedPayment?.fee_customer.flat || 0) + cartSubtotal);
  }, [cartSubtotal, shippingFee, selectedPayment]);

  const handleClick = (payment) => {
    setSelectedPayment(payment);
  };

  useEffect(() => {
    async function getPaymentOptions() {
      const res = await fetch("/api/payment/channels");
      const response = await res.json();
      setPaymentOptions(response.data);
      setSelectedPayment(response.data[0]);
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

  async function handleCheckout() {
    let orderItems = [];
    for (let data of cartItems) {
      orderItems.push({
        product_iteration_id: data.product_iteration_id,
        quantity: cart[data.product_iteration_id].qty,
      });
    }

    console.log({
      guest_full_name: name,
      guest_address: selectedArea.name,
      guest_area_id: selectedArea.id,
      guest_phone_number: phone,
      guest_email: confirmEmail,
      note_for_courier: addressNotes,
      note_for_seller: sellerNotes,
      courier_id: "3",
      payment_method: selectedPayment.code,
      discount_code: "adsa",
      order_items: orderItems,
    });

    const res = await fetch("/api/orders/guest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guest_full_name: name,
        guest_address: selectedArea.name,
        guest_area_id: selectedArea.id,
        guest_phone_number: phone,
        guest_email: confirmEmail,
        note_for_courier: addressNotes,
        note_for_seller: sellerNotes,
        courier_id: "1",
        payment_method: selectedPayment.code,
        discount_code: "adsa",
        order_items: orderItems,
      }),
    }).then((r) => r.json());

    console.log(res);
  }
  return (
    <>
      <div className="min-h-dvh w-full max-w-screen-xl mx-auto px-8 text-cyan-900">
        <div className="mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="mt-5">
                <div className="mt-5 ">
                  <div>
                    <Input
                      type={"email"}
                      id={"email"}
                      name={"email"}
                      title={"Email"}
                      placeholder={"email@gmail.com"}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mt-5">
                    <Input
                      type={"text"}
                      id={"confirmEmail"}
                      name={"confirmEmail"}
                      title={"Konfirmasi Email"}
                      placeholder={"email@gmail.com"}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                    />
                    {confirmEmail != email && (
                      <div className="text-red-500">
                        *email dan konfirmasi email tidak sama, periksa kembali.
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-5">
                  <div className=" mt-5">
                    {/* input Nama */}
                    <Input
                      type={"text"}
                      id={"name"}
                      name={"name"}
                      title={"Name"}
                      placeholder={"Nama Lengkap"}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="mt-5">
                    {/* input Nomor Telepon */}
                    <Input
                      type={"text"}
                      id={"phone"}
                      name={"phone"}
                      title={"Nomor HP"}
                      placeholder={"08123456789"}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <Input
                  type={"textarea"}
                  title={"Catatan untuk Penjual (Opsional)"}
                  placeholder="Catatan untuk penjual, jika ada"
                  onChange={(e) => setSellerNotes(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div>
                {/* Search Address */}
                <div className="w-full mt-5">
                  <h1 className="font-bold font-fredoka text-2xl">
                    Cari Alamat
                  </h1>
                  <div className="flex gap-2 mb-2">
                    <input
                      type={"text"}
                      placeholder="Masukkan kata kunci untuk mencari alamat pengiriman"
                      onChange={(e) => setAreasSearchText(e.target.value)}
                      className="w-full p-5 outline-none mt-1"
                    />
                    <div
                      className="p-5 bg-cyan-400 text-white cursor-pointer mt-1"
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
                        <h2>
                          {selectedArea.administrative_division_level_1_name}
                        </h2>
                      </div>
                      <div>
                        <h1 className="font-bold first-letter:uppercase">
                          {selectedArea.administrative_division_level_2_type}
                        </h1>
                        <h2>
                          {selectedArea.administrative_division_level_2_name}
                        </h2>
                      </div>
                      <div>
                        <h1 className="font-bold first-letter:uppercase">
                          {selectedArea.administrative_division_level_3_type}
                        </h1>
                        <h2>
                          {selectedArea.administrative_division_level_3_name}
                        </h2>
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
            </div>
          </div>

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
                    selectedPayment?.code == payment.code &&
                    "border-b-8 border-cyan-400"
                  }`}
                  onClick={() => handleClick(payment)}
                >
                  <Image
                    src={payment.icon_url}
                    width={1080}
                    height={1080}
                    className="w-[120px] aspect-[3/1] object-contain mx-auto"
                  />
                  {payment.name}
                </button>
              ))}
            </div>

            {/* Subtotal Item */}
            <div className="mt-5 p-5 bg-white">
              <h1 className="font-bold text-xl">Subtotal</h1>
              <div className="max-w-xs">
                <div className="grid grid-cols-2 gap-2">
                  <h1 className="w-full">
                    {cartItems.length} items{" "}
                    <Link
                      href="/cart"
                      target="_blank"
                      className="text-cyan-500"
                    >
                      (view)
                    </Link>
                  </h1>
                  <p>
                    {cartSubtotal == 0 ? (
                      "Loading..."
                    ) : (
                      <span>
                        Rp{Intl.NumberFormat("id-ID").format(cartSubtotal)}
                      </span>
                    )}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <h1>Shipping Fee</h1>
                  <p>Rp0 (Implement Me)</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <h1>Payment Fee</h1>
                  <div>
                    Rp
                    {Intl.NumberFormat("id-ID").format(
                      selectedPayment?.fee_customer.flat || 0
                    )}
                    <p className="text-sm text-cyan-500">
                      {selectedPayment?.code}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <h1 className="font-bold">Subtotal</h1>
                  <p className="font-bold">
                    Rp{Intl.NumberFormat("id-ID").format(subtotal)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-y-4 mt-8 p-8">
              <div className="">
                <Button type={2} onClick={() => handleCheckout()}>
                  CHECKOUT !
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
