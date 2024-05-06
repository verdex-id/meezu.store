"use client";

import { useState } from "react";
import Link from "next/link";
import CardTextIcon from "@/icons/card_text";
import Image from "next/image";
import ChevronDownIcon from "@/icons/chevron_down";

export default function ProductDetailScreen({ product }) {
  const [images, setImages] = useState([
    "/banner/banner_1.png",
    "/images/Thumbnail.svg",
    "/logo/akudav.png",
  ]);
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const [loading, setLoading] = useState(false);
  const [successAddCart, setSuccessAddCart] = useState();

  const [quantity, setQuantity] = useState(1);

  function handleAddToCart(productIteration, quantity) {
    setLoading(true);
    setSuccessAddCart(null);

    let cart = {};
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart")) || {};
    }

    cart[productIteration.product_iteration_id] = {
      id: productIteration.product_iteration_id,
      qty:
        (Number(cart[productIteration.product_iteration_id]?.qty) || 0) +
        Number(quantity),
    };

    localStorage.setItem("cart", JSON.stringify(cart));

    setSuccessAddCart(productIteration);
    setLoading(false);
  }

  function handleChangeImage(action) {
    if (action == "next") {
      const index = images.findIndex((i) => i == selectedImage);
      if (images[index + 1]) {
        setSelectedImage(images[index + 1]);
      } else {
        setSelectedImage(images[0]);
      }
    } else {
      const index = images.findIndex((i) => i == selectedImage);
      if (images[index - 1]) {
        setSelectedImage(images[index - 1]);
      } else {
        setSelectedImage(images.length - 1);
      }
    }
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-8 mt-5 pb-96">
      <div>
        <div className="space-y-4">
          <div className="flex gap-1">
            <CardTextIcon className="w-5 text-cyan-700" />
            <p className="text-cyan-700">
              {product.product_category.product_category_name}
            </p>
          </div>
          <h1 className="font-bold font-baloo text-3xl md:text-6xl">
            {product.product_name}
          </h1>
          <p className="p-5 bg-white">{product.product_description}</p>

          <div>
            {product.product_iterations.map((iteration, i) => (
              <div
                key={i}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-5"
              >
                <div className="relative">
                  <div className="relative h-full max-w-[400px] lg:max-w-full aspect-square mx-auto">
                    <Image src={selectedImage} fill className="object-cover" />
                  </div>
                  <div className="absolute bottom-5 left-0 w-full">
                    <div className="flex gap-2 mx-auto w-max">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          className="p-1"
                          onClick={() => setSelectedImage(img)}
                        >
                          <div
                            className={`w-2 h-2 rounded-full bg-slate-500 ${
                              selectedImage == img &&
                              "bg-slate-900 border-2 border-black"
                            }`}
                          ></div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="h-full w-full flex items-center justify-between">
                      <button
                        className="p-5 h-full"
                        onClick={() => handleChangeImage("back")}
                      >
                        <ChevronDownIcon className="w-10 rotate-90 text-white" />
                      </button>
                      <button
                        className="p-5 h-full"
                        onClick={() => handleChangeImage("next")}
                      >
                        <ChevronDownIcon className="w-10 -rotate-90 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-2 border-cyan-700 h-max">
                  <p className="text-xl font-bold">
                    Rp
                    {Intl.NumberFormat("id-ID").format(
                      iteration.product_variant_price
                    )}
                  </p>
                  <p>Stock: {iteration.product_variant_stock}</p>
                  <h1 className="font-bold mt-2">Informasi Tambahan</h1>
                  <div className="flex gap-2">
                    {iteration.product_variant_mapping.map((variant, i) => (
                      <div
                        key={i}
                        className={`border-b-4 border-cyan-300 min-w-[100px]`}
                      >
                        <p className="text-xs text-cyan-500">
                          {variant.variant.varian_type.variant_type_name}
                        </p>
                        <h1>{variant.variant.variant_name}</h1>
                      </div>
                    ))}
                  </div>
                  <input
                    type="number"
                    placeholder="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-5 px-5 py-3 w-full border-2 border-cyan-300"
                    min={1}
                    max={iteration.product_variant_stock}
                  />
                  <div className="space-y-4 mt-5">
                    {successAddCart == iteration && (
                      <div className="w-full p-3 bg-green-200">
                        <span>
                          Berhasil menambahkan ke keranjang.{" "}
                          <Link
                            href="/cart"
                            className="underline text-cyan-700"
                          >
                            Lihat keranjang
                          </Link>
                        </span>
                      </div>
                    )}
                    <button
                      className={`p-3 w-full bg-pink-300 text-white`}
                      onClick={() => handleAddToCart(iteration, quantity)}
                    >
                      {loading ? "Loading..." : "Add to cart"}
                    </button>
                    <Link
                      href={`/cart`}
                      onClick={() => handleAddToCart(iteration, quantity)}
                      className="p-3 w-full bg-cyan-400 text-white block text-center"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
