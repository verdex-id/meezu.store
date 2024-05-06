"use client";

import Button from "@/components/button";
import MinusIcon from "@/icons/minus";
import PlusIcon from "@/icons/plus";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const [cartLocal, setCartLocal] = useState({});

  useEffect(() => {
    if (localStorage.getItem("cart")) {
      setCartLocal(JSON.parse(localStorage.getItem("cart")));
    }
  }, []);

  useEffect(() => {
    let temp = 0;
    for (let product of cartItems) {
      temp +=
        product.product_variant_price *
        cartLocal[product.product_iteration_id].qty;
    }
    setSubtotal(temp);
  }, [cartItems, cartLocal]);

  useEffect(() => {
    async function getProductIterations() {
      setLoading(true);

      const cartLocalInitial = JSON.parse(localStorage.getItem("cart"));
      const ids = [];
      for (const id in cartLocalInitial) {
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

      setLoading(false);
      if (res.status == "success") {
        setCartItems(res.data.products);
      }
    }
    getProductIterations();
  }, []);

  function handleDecreaseCart(id) {
    let cart = {};
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart")) || {};
    }

    if (Number(cart[id].qty) <= 1) {
      delete cart[id];
      localStorage.setItem("cart", JSON.stringify(cart));
      window.location.reload();
      return;
    }

    cart[id] = {
      id: id,
      qty: (Number(cart[id]?.qty) || 0) - 1,
    };

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartLocal(cart);
  }

  function handleIncreaseCart(id) {
    let cart = {};
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart")) || {};
    }

    cart[id] = {
      id: id,
      qty: (Number(cart[id]?.qty) || 0) + 1,
    };

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartLocal(cart);
  }
  return (
    <>
      <div className="min-h-dvh w-full max-w-screen-xl mx-auto px-8 pb-16 mt-5">
        <h1 className="font-bold text-2xl">
          Keranjang{" "}
          {loading && <span className="font-normal">(Loading...)</span>}
        </h1>

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
                    <h1>{cart.product.product_name}</h1>
                  </div>
                  <div className="text-sm text-cyan-700 flex gap-2">
                    {cart.product_variant_mapping.map((pv, i) => (
                      <div key={i}>
                        <p className="text-xs">
                          {pv.variant.varian_type.variant_type_name}
                        </p>
                        <p className="font-bold">{pv.variant.variant_name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-8 text-center">
                  <div>
                    <h1>Harga Satuan</h1>
                    <p>
                      Rp
                      {Intl.NumberFormat("id-ID").format(
                        cart.product_variant_price
                      )}
                    </p>
                  </div>
                  <div>
                    <h1>Jumlah</h1>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleDecreaseCart(cart.product_iteration_id)
                        }
                      >
                        <MinusIcon className="w-6" />
                      </button>
                      <p>{cartLocal[cart.product_iteration_id].qty}</p>
                      <button
                        onClick={() =>
                          handleIncreaseCart(cart.product_iteration_id)
                        }
                        disabled={
                          cart.product_variant_stock <=
                          cartLocal[cart.product_iteration_id].qty
                        }
                      >
                        <PlusIcon className="w-6" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h1>Total</h1>
                    <p>
                      Rp
                      {Intl.NumberFormat("id-ID").format(
                        cart.product_variant_price *
                          cartLocal[cart.product_iteration_id].qty
                      )}
                    </p>
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
                <p>
                  Rp
                  {Intl.NumberFormat("id-ID").format(subtotal)}
                </p>
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
