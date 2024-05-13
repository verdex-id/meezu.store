"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PaymentScreen({ order, payment, instruction }) {
  const [copied, setCopied] = useState(false);
  const [showTutorial, setTutorial] = useState();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [emailCooldown, setEmailCooldown] = useState(0);

  const expiredDateTime = new Date(payment.expired_time * 1000);
  const paidDateTime = new Date(payment.paid_at * 1000);

  useEffect(() => {
    setTimeout(() => {
      if (emailCooldown >= 1) {
        setEmailCooldown(emailCooldown - 1);
      }
    }, 1000);
  }, [success, error, emailCooldown]);

  function handleCopy() {
    setCopied(false);
    navigator.clipboard.writeText(payment.pay_code);
    setCopied(true);
  }

  async function handleSendEmail() {
    setLoading(true);

    const res = await fetch(
      "/api/orders/guest/email?order_code=" + order.order_code
    ).then((r) => r.json());

    setEmailCooldown(10);
    setLoading(false);

    if (res.status == "success") {
      setSuccess(true);
    } else if (res.status == "fail") {
      setSuccess(false);
      setError(res.message);
    }
  }

  async function handleCancelOrder() {
    const res = await fetch(
      "/api/orders/cancel?order_code=" + order.order_code,
      {
        method: "DELETE",
      }
    ).then((r) => r.json());

    if (res.status == "success") {
      window.location.replace("/merch");
    }
  }
  return (
    <>
      <div className="w-full max-w-screen-sm mx-auto px-8 min-h-dvh mt-8 pb-96">
        <Link href={"/"} className="p-5 bg-white relative h-24 block">
          <Image
            src={"/logo/logo_meezu.png"}
            fill
            className="object-contain"
            alt="Logo"
          />
        </Link>
        <div className="p-5 bg-white mt-5">
          <div className="text-center">
            <p className="text-xs text-slate-700">{order.order_code}</p>
            <h1 className="font-bold text-3xl">Pembayaran</h1>
            {payment.status == "UNPAID" && (
              <>
                <h2 className="font-bold text-2xl text-red-400">UNPAID</h2>
                <h2>
                  Terimakasih atas pesanan anda, silahkan lakukan pembayaran
                  dibawah ini.
                </h2>
              </>
            )}
            {payment.status == "PAID" && (
              <>
                <h2 className="font-bold text-2xl text-green-400">PAID</h2>
                <h2>
                  Terimakasih atas pesanan anda, pembayaran sudah diterima.
                  Pesanan akan segera di proses
                </h2>
                <Link
                  href={"/track/" + order.order_code}
                  className="text-cyan-700 border-2 border-cyan-400 px-5 py-2 block w-max mx-auto mt-5"
                >
                  Track Pengiriman
                </Link>
              </>
            )}
          </div>
          <hr className="border-2 border-cyan-200 mt-5" />
          <div className="mt-5">
            {payment.status != "PAID" && (
              <div className="p-5 bg-cyan-200 text-center">
                <h1 className="font-bold">{payment.payment_name}</h1>
                {payment.payment_method.includes("QRIS") ? (
                  <div className="p-5 bg-white">
                    <div className="relative h-72 w-full">
                      <Image
                        src={payment.qr_url}
                        alt="QRIS"
                        className="object-contain"
                        fill
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {payment.pay_code && (
                      <div className="cursor-pointer" onClick={handleCopy}>
                        <p
                          className={`p-5 text-sm md:text-2xl font-bold tracking-widest font-mono ${
                            copied ? "bg-green-50" : "bg-white"
                          }`}
                        >
                          {payment.pay_code}
                        </p>
                        <p className="text-xs">
                          {copied ? "Copied" : "Click to Copy"}
                        </p>
                      </div>
                    )}

                    {payment.pay_url && (
                      <Link href={payment.pay_url} target="_blank">
                        <p
                          className={`p-5 text-sm md:text-2xl font-bold tracking-widest font-mono ${
                            copied ? "bg-green-50" : "bg-white"
                          }`}
                        >
                          Click to Pay
                        </p>
                      </Link>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="mt-5 text-center">
            {payment.status == "PAID" ? (
              <p>
                Telah dibayar pada{" "}
                <span className="font-medium">
                  {paidDateTime.toLocaleString("id-ID")}
                </span>
              </p>
            ) : (
              <p>
                Lakukan pembayaran sebelum{" "}
                <span className="font-medium">
                  {expiredDateTime.toLocaleString("id-ID")}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="p-5 bg-white mt-5">
          <h1 className="font-bold">Items</h1>
          <div className="font-mono text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 bg-cyan-200 font-bold px-2">
              <p>Name</p>
              <p>Subtotal</p>
            </div>
            {payment.order_items.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 px-2"
              >
                <h1>
                  {item.quantity}x {item.name}
                </h1>
                <h2>
                  Rp
                  {Intl.NumberFormat("id-ID").format(item.subtotal)}
                </h2>
              </div>
            ))}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 px-2">
              <p>Payment Fee</p>
              <p>Rp{payment.fee_customer}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 px-2 bg-slate-100 font-bold">
              <p>Total</p>
              <p>Rp{payment.amount}</p>
            </div>
          </div>
        </div>

        {success && (
          <div className="p-5 border-l-4 border-green-400 bg-white mt-5">
            Success! Berhasil mengirim email ke {order.guest_order.guest_email}
          </div>
        )}

        {error && (
          <div className="p-5 border-l-4 border-red-400 bg-white mt-5">
            Error! {error}
          </div>
        )}

        <div className="p-5 bg-white mt-5">
          <button
            className="bg-cyan-400 text-white px-5 py-2 w-full"
            onClick={handleSendEmail}
            disabled={emailCooldown > 0}
          >
            {emailCooldown > 0
              ? loading
                ? "Loading..."
                : `Send Invoice to ${order.guest_order.guest_email} (${emailCooldown}s)`
              : loading
              ? "Loading..."
              : `Send Invoice to ${order.guest_order.guest_email}`}
          </button>
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

        {payment.status == "UNPAID" && (
          <div className="mt-5 text-center">
            <button onClick={handleCancelOrder} className="text-red-500">
              Cancel Order
            </button>
            <p className="text-xs">
              *Warning: Dengan 1x klik anda akan mengajukan pembatalan pesanan
              ini. Pengajuan dapat diterima atau ditolak oleh Admin.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
