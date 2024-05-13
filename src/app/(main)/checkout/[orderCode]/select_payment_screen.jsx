"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/button";
import Link from "next/link";

export default function SelectPaymentScreen({ order }) {
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState();

  const [success, setSuccess] = useState();
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [discountCode, setDiscountCode] = useState();

  useEffect(() => {
    async function getPaymentOptions() {
      const res = await fetch("/api/payment/channels");
      const response = await res.json();
      setPaymentOptions(response.data);
      setSelectedPayment(response.data[0]);
    }
    getPaymentOptions();
  }, []);

  async function handleSetPayment() {
    setLoading(true);
    setSuccess(false);
    setError("");

    const payload = {
      payment_method: selectedPayment.code,
      discount_code: discountCode ? discountCode : undefined,
    };

    const res = await fetch(
      `/api/orders/guest/payment?order_code=${order.order_code}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    ).then((r) => r.json());

    setLoading(false);

    if (res.status == "success") {
      setSuccess(true);
      setEmailLoading(true);
      setEmailSuccess(false);

      const res = await fetch(
        "/api/orders/guest/email?order_code=" + order.order_code
      ).then((r) => r.json());

      if (res.status == "success") {
        setEmailSuccess(true);
        setEmailLoading(false);
        window.location.replace("/payment/" + order.order_code);
      } else {
        setEmailError(res.message);
        setEmailLoading(false);
      }
    } else if (res.status == "fail") {
      setSuccess(false);
      setError(res.message);
    }
  }

  async function handleCancel() {
    setLoading(true);
    const res = await fetch(
      "/api/orders/cancel?order_code=" + order.order_code,
      {
        method: "DELETE",
      }
    ).then((r) => r.json());

    setLoading(false);
    if (res.status == "success") {
      window.location.replace("/");
    }
  }
  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto px-8 min-h-dvh mt-5 pb-96">
        <div className="p-5 bg-white">
          <h1 className="font-bold text-xl">Order Details</h1>
          <h2 className="font-mono px-2 bg-cyan-100 w-max text-cyan-700 text-sm">
            {order.order_code}
          </h2>
          <p>
            Pastikan pesanan anda sudah sesuai dan segera memilih metode
            pembayaran.
          </p>
          <div className="mt-5 p-5 bg-slate-100">
            <p className="text-sm">
              {order.shipment.courier.courier_name} -{" "}
              {order.shipment.courier.courier_service_name}
            </p>
            <p className="font-medium">{order.guest_order.guest_email}</p>
            <p>{order.invoice.customer_full_address}</p>
            <p>{order.guest_order.guest_note_for_courier}</p>
          </div>
          <div className="mt-5 p-5 bg-slate-100">
            <div className="w-max">
              {order.invoice.invoice_item.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8"
                >
                  <h1>
                    {item.invoice_item_quantity}x {item.invoice_item_name}
                  </h1>
                  <h2>
                    Rp
                    {Intl.NumberFormat("id-ID").format(
                      item.invoice_item_total_price
                    )}
                  </h2>
                </div>
              ))}
              <hr className="border-2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
                <h1 className="font-medium">Item Subtotal</h1>
                <h2>
                  Rp
                  {Intl.NumberFormat("id-ID").format(order.invoice.gross_price)}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
                <h1 className="font-medium">Shipping Cost</h1>
                <h2>
                  Rp
                  {Intl.NumberFormat("id-ID").format(
                    order.invoice.shipping_cost
                  )}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
                <h1 className="font-medium">Payment Fee</h1>
                <h2>
                  Rp
                  {Intl.NumberFormat("id-ID").format(
                    selectedPayment?.fee_customer.flat
                  )}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
                <h1 className="font-medium">Discount</h1>
                <h2 className="text-red-400">
                  Rp
                  {Intl.NumberFormat("id-ID").format(
                    order.invoice.discount_amount
                  )}
                </h2>
              </div>
              <hr className="border-2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
                <h1 className="font-medium">Subtotal</h1>
                <h2 className="font-medium">
                  Rp
                  {Intl.NumberFormat("id-ID").format(
                    order.invoice.gross_price +
                      order.invoice.shipping_cost +
                      selectedPayment?.fee_customer.flat -
                      order.invoice.discount_amount
                  )}
                </h2>
              </div>
            </div>
          </div>

          <div className="mt-5 bg-slate-100 p-5">
            <h1 className="font-bold">Punya Voucher Discount?</h1>
            <input
              type="text"
              placeholder="MERCH7"
              className="px-5 py-2 bg-white outline-none"
              onChange={(e) => setDiscountCode(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-5">
          <h1 className="font-bold text-xl">Select Payment Method</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-5">
            {paymentOptions.map((payment) => (
              <button
                key={payment.code}
                className={`p-5 bg-white text-cyan-900 w-full ${
                  selectedPayment?.code == payment.code &&
                  "border-b-8 border-cyan-400"
                }`}
                onClick={() => setSelectedPayment(payment)}
              >
                <Image
                  src={payment.icon_url}
                  width={1080}
                  height={1080}
                  className="w-[120px] aspect-[3/1] object-contain mx-auto"
                />
                <p>{payment.name}</p>
                {payment.fee_customer.flat > 0 && (
                  <p className="text-green-500 text-sm">
                    + Rp
                    {Intl.NumberFormat("id-ID").format(
                      payment.fee_customer.flat
                    )}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

        {success == true && (
          <div className="mt-5 border-l-4 border-green-400 bg-white p-5">
            Success! Loading... Mencoba mengirim invoice ke email
          </div>
        )}

        {emailError == true && (
          <div className="mt-5 border-l-4 border-red-400 bg-white p-5">
            Gagal mengirim email! Silahkan ke invoice dan coba kirim email
            ulang. Simpan link berikut untuk berjaga jaga.
            <Link
              href={`/payment/${order.order_code}`}
              className="text-green-500"
            >
              klik disini untuk ke invoice.
            </Link>
          </div>
        )}

        {emailSuccess == true && (
          <div className="mt-5 border-l-4 border-green-400 bg-white p-5">
            Success! Anda akan diarahkan otomatis ke halaman pembayaran. Jika
            tidak,{" "}
            <Link
              href={`/payment/${order.order_code}`}
              className="text-green-500"
            >
              klik disini.
            </Link>
          </div>
        )}

        {error && (
          <div className="mt-5 border-l-4 border-red-400 bg-white p-5">
            Error! {error}
          </div>
        )}

        <div className="mt-5 flex gap-4">
          <Button type={2} onClick={handleSetPayment}>
            {loading ? (
              "Loading..."
            ) : (
              <>
                Bayar Rp
                {Intl.NumberFormat("id-ID").format(
                  order.invoice.gross_price +
                    order.invoice.shipping_cost +
                    selectedPayment?.fee_customer.flat -
                    order.invoice.discount_amount
                )}
              </>
            )}
          </Button>
          <button onClick={handleCancel} className="text-red-500 px-5">
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
