"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ChevronDownIcon from "@/icons/chevron_down";

export default function ProductIterationDetailScreen({ iteration }) {
  const [selectedImage, setSelectedImage] = useState(
    iteration.iteration_images[0]
  );

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
      const index = iteration.iteration_images.findIndex(
        (i) => i == selectedImage
      );
      if (iteration.iteration_images[index + 1]) {
        setSelectedImage(iteration.iteration_images[index + 1]);
      } else {
        setSelectedImage(iteration.iteration_images[0]);
      }
    } else {
      const index = iteration.iteration_images.findIndex(
        (i) => i == selectedImage
      );
      if (iteration.iteration_images[index - 1]) {
        setSelectedImage(iteration.iteration_images[index - 1]);
      } else {
        setSelectedImage(
          iteration.iteration_images[iteration.iteration_images.length - 1]
        );
      }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-5 my-5">
      <div className="relative">
        {selectedImage && (
          <>
            <div className="relative h-max max-w-[400px] lg:max-w-full aspect-square mx-auto">
              <Image
                src={selectedImage.iteration_image_path}
                fill
                className="object-cover"
                alt="Image"
              />
            </div>
            <div className="absolute bottom-5 left-0 w-full">
              <div className="flex gap-2 mx-auto w-max">
                {iteration.iteration_images
                  .filter(
                    (image) =>
                      image.product_iteration_id ==
                      iteration.product_iteration_id
                  )
                  .map((img, i) => (
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
          </>
        )}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="h-full w-full flex items-center justify-between">
            <button
              className="p-5 h-full"
              onClick={() => handleChangeImage("back")}
            >
              <ChevronDownIcon className="w-10 rotate-90 text-white bg-black/5 rounded-xl" />
            </button>
            <button
              className="p-5 h-full"
              onClick={() => handleChangeImage("next")}
            >
              <ChevronDownIcon className="w-10 -rotate-90 text-white bg-black/5 rounded-xl" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 border-2 border-cyan-700 h-max">
        <p className="text-xl font-bold">
          Rp
          {Intl.NumberFormat("id-ID").format(iteration.product_variant_price)}
        </p>
        <p>Stock: {iteration.product_variant_stock}</p>
        <h1 className="font-bold mt-2">Informasi Tambahan</h1>
        <div className="flex gap-2">
          {iteration.product_variant_mapping.map((variant, i) => (
            <div key={i} className={`border-b-4 border-cyan-300 min-w-[100px]`}>
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
                <Link href="/cart" className="underline text-cyan-700">
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
  );
}
