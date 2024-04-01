"use client";

import Button from "@/components/button";
import MinusIcon from "@/icons/minus";
import PlusIcon from "@/icons/plus";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([
    {
      test: 1,
    },
    {
      test: 1,
    },
  ]);

  return (
    <>
      <div className="min-h-dvh w-full max-w-screen-xl mx-auto px-8 pb-16 mt-5">
        <h1 className="font-bold text-2xl">Keranjang</h1>

        <div className="mt-5 space-y-5">
          {cartItems.map((cart, i) => (
            <div className="space-y-2" key={i}>
              <hr className="border-2 border-cyan-700" />
              <div className="flex gap-2 justify-between">
                <div className="flex gap-2">
                  <div className="w-12 h-12 bg-cyan-400 relative">
                    <Image src={"/logo/akudav2.png"} fill />
                  </div>
                  <div>
                    <h1>T-Shirt Ella JKT48</h1>
                  </div>
                  <div className="text-sm text-cyan-700">
                    <p>Varian: Hitam</p>
                    <p>Ukuran: XL</p>
                  </div>
                </div>
                <div className="flex gap-8 text-center">
                  <div>
                    <h1>Harga Satuan</h1>
                    <p>Rp100.000</p>
                  </div>
                  <div>
                    <h1>Jumlah</h1>
                    <div className="flex gap-2">
                      <button>
                        <MinusIcon className="w-6" />
                      </button>
                      <p>1</p>
                      <button>
                        <PlusIcon className="w-6" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h1>Total</h1>
                    <p>Rp100.000</p>
                  </div>
                </div>
              </div>
              <hr className="border-2 border-cyan-700" />
            </div>
          ))}
          <div className="mt-8">
            <div className="flex text-center justify-end">
              <div>
                <h1 className="font-semibold text-xl">Subtotal</h1>
                <p>Rp100.000</p>
              </div>
            </div>
            <hr className="border-2 border-cyan-700 mt-2" />
          </div>
          <div className="mt-8 flex justify-end">
            <div>
              <Button type={2} href={"/checkout"}>
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
