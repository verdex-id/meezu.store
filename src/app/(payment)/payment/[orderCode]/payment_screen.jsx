"use client";

import { useState } from "react";
import Image from "next/image";

export default function PaymentScreen({ payment, instruction }) {
  const [copied, setCopied] = useState(false);
  const [showTutorial, setTutorial] = useState();

  const expiredDateTime = new Date(payment.expired_at * 1000);

  function handleCopy() {
    setCopied(false);
    navigator.clipboard.writeText(payment.pay_code);
    setCopied(true);
  }
  return (
    <>
      <div className="w-full max-w-screen-sm mx-auto px-8 min-h-dvh mt-8 pb-96">
        <div className="p-5 bg-white relative h-24">
          <Image src={"/logo/logo_meezu.png"} fill className="object-contain" />
        </div>
        <div className="p-5 bg-white mt-5">
          <div className="text-center">
            <h1 className="font-bold text-3xl">Pembayaran</h1>
            <h2>
              Terimakasih atas pesanan anda, silahkan lakukan pembayaran dibawah
              ini.
            </h2>
          </div>
          <hr className="border-2 border-cyan-200 mt-5" />
          <div className="mt-5">
            <div className="p-5 bg-cyan-200 text-center">
              <h1 className="font-bold">{payment.payment_name}</h1>
              <div className="cursor-pointer" onClick={handleCopy}>
                <p
                  className={`p-5 text-2xl font-bold tracking-widest font-mono ${
                    copied ? "bg-green-50" : "bg-white"
                  }`}
                >
                  {payment.pay_code}
                </p>
                <p className="text-xs">{copied ? "Copied" : "Click to Copy"}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 text-center">
            <p>
              Lakukan pembayaran sebelum{" "}
              <span className="font-bold">
                {expiredDateTime.toLocaleString("id-ID")}
              </span>
            </p>
          </div>
        </div>

        <div className="p-5 bg-white mt-5">
          <h1 className="font-bold">Items</h1>
          <div className="font-mono text-sm">
            <div className="grid grid-cols-3 px-2 bg-cyan-200 font-bold">
              <p>Name</p>
              <p>Price</p>
              <p>Subtotal</p>
            </div>
            {payment.order_items.map((item, i) => (
              <div key={i} className="grid grid-cols-3 px-2 bg-cyan-100">
                <p>
                  {item.quantity}x {item.name}
                </p>
                <p>Rp{item.price}</p>
                <p>Rp{item.subtotal}</p>
              </div>
            ))}
            <div className="grid grid-cols-3 px-2 bg-cyan-100">
              <p>Payment Fee</p>
              <p></p>
              <p>Rp{payment.fee_customer}</p>
            </div>
            <div className="grid grid-cols-3 px-2 bg-cyan-200 font-bold">
              <p>Total</p>
              <p></p>
              <p>Rp{payment.amount}</p>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white space-y-2 mt-5">
          <button
            className="w-full outline-none"
            onClick={() => setTutorial(!showTutorial)}
          >
            <h1 className="font-bold text-xl">Instruksi Pembayaran</h1>
            <p className="text-cyan-500">
              Click to {showTutorial ? "Hide" : "Show"}
            </p>
          </button>
          {showTutorial &&
            instruction.map((ins, i) => (
              <div key={i} className="p-5 border-2 border-cyan-200">
                <h1 className="font-bold">{ins.title}</h1>
                <div className="space-y-1">
                  {ins.steps.map((step, i) => (
                    <li key={i} className="list-decimal list-inside">
                      {step
                        .replace("{{pay_code}}", payment.pay_code)
                        .replace("{{amount}}", payment.amount)}
                    </li>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
