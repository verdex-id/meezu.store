"use client";

import { useState } from "react";

export default function ProductDetailScreen({ product }) {
  const [selectedVariant, setSelectedVariant] = useState();

  return (
    <div className="w-full max-w-screen-xl mx-auto px-8 mt-5 pb-96">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="grid grid-cols-2 gap-2 max-w-lg">
          <div className="w-full col-span-2 aspect-video bg-pink-300"></div>
          <div className="w-full aspect-square bg-pink-300"></div>
          <div className="w-full aspect-square bg-pink-300"></div>
        </div>
        <div className="space-y-8">
          <h1 className="font-bold font-baloo text-3xl md:text-6xl">
            {product.product_name}
          </h1>
          <p className="font-fredoka">{product.product_description}</p>
          <div>
            {product.product_iterations.map((iteration, i) => (
              <div key={i} className="p-5 border-2 border-cyan-700">
                <p className="text-xl font-bold">
                  Rp
                  {Intl.NumberFormat("id-ID").format(
                    iteration.product_variant_price
                  )}
                </p>
                <div className="flex gap-2 mt-2">
                  {iteration.product_variant_mapping.map((variant, i) => (
                    <button
                      key={i}
                      className={`px-5 py-2 ${
                        selectedVariant == variant
                          ? "bg-white/70 border-b-4 border-b-cyan-700"
                          : "bg-white"
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      <h1>{variant.variant.variant_name}</h1>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-lg">Terjual 1078</p>
          <div className="space-y-4">
            <button className="p-3 w-full bg-pink-300 text-white">
              Add to cart
            </button>
            <button className="p-3 w-full bg-cyan-400 text-white">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
