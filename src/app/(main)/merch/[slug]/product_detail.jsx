"use client";

import CardTextIcon from "@/icons/card_text";
import ProductIterationDetailScreen from "./product_iteration_detail";

export default function ProductDetailScreen({ product }) {
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
              <ProductIterationDetailScreen iteration={iteration} key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
