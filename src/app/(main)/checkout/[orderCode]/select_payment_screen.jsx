"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SelectPaymentScreen({ order }) {
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState();

  useEffect(() => {
    async function getPaymentOptions() {
      const res = await fetch("/api/payment/channels");
      const response = await res.json();
      setPaymentOptions(response.data);
      setSelectedPayment(response.data[0]);
    }
    getPaymentOptions();
  }, []);

  function handleClick(payment) {
    setSelectedPayment(payment);
  }

  async function handleSetPayment() {
    const res = await fetch(
      `/api/orders/guest/payment?order_code=${params.orderCode}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      }
    ).then((r) => r.json());
  }
  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto px-8 min-h-dvh mt-5">
        <h1 className="font-bold">Select Payment Method</h1>
        <h2 className="font-mono">{order.order_code}</h2>
        <div className="mt-5">
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
        </div>
      </div>
    </>
  );
}
