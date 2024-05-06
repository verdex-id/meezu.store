"use client";

import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
import AddVariantModal from "./add_variant_modal";

export default function AdminDashboardProductEditScreen({ product }) {
  const cookie = useCookies();

  console.log(product);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [showAddVariantModal, setShowAddVariantModal] = useState(false);
  const [selectedIterationId, setSelectedIterationId] = useState();

  async function handleEditBasicProduct(e) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.get("access_token"),
      },
      body: JSON.stringify({
        product_category_name: formData.get("product_category_name"),
        product_name: formData.get("product_name"),
        product_description: formData.get("product_description"),
        product_iteration: {
          product_variant_weight: formData.get("product_variant_weight"),
          product_variant_stock: formData.get("product_variant_stock"),
          product_variant_price: formData.get("product_variant_price"),
        },
      }),
    }).then((r) => r.json());

    setLoading(false);

    if (res.status == "success") {
      window.location.replace(
        "/admin/dashboard/product/edit/" + res.data.created_product.product_slug
      );
    } else {
      setSuccess(false);
      setError(res.message);
    }
  }
  return (
    <>
      {showAddVariantModal && (
        <AddVariantModal
          productIterationId={selectedIterationId}
          setShowAddVariantModal={setShowAddVariantModal}
        />
      )}
      <div className="w-full max-w-screen-sm mx-auto px-8 min-h-dvh">
        <h1 className="font-bold text-xl">
          Edit Product {product.product_name}
        </h1>

        <form
          method="post"
          className="p-5 bg-white mt-5"
          onSubmit={handleEditBasicProduct}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="col-span-2">
              <h1 className="font-bold">Nama Produk</h1>
              <input
                type="text"
                name="product_name"
                placeholder="Contoh: T-Shirt Dino"
                className="px-5 py-2 w-full bg-white border-2 border-cyan-200 outline-none"
                min={3}
                max={50}
                defaultValue={product.product_name}
                required
              />
            </div>
            <div>
              <h1 className="font-bold">Nama Kategori</h1>
              <input
                type="text"
                name="product_category_name"
                placeholder="Contoh: Baju"
                className="px-5 py-2 w-full bg-white border-2 border-cyan-200 outline-none text-black/50"
                min={3}
                max={50}
                defaultValue={product.product_category.product_category_name}
                disabled
                required
              />
            </div>
          </div>
          <div>
            <h1 className="font-bold">Deskripsi Produk</h1>
            <textarea
              name="product_description"
              cols="3"
              className="px-5 py-2 w-full bg-white border-2 border-cyan-200 outline-none"
              minLength={3}
              maxLength={2000}
              defaultValue={product.product_description}
              required
            ></textarea>
          </div>
          <div className="mt-5">
            <button className="px-5 py-2 bg-cyan-400 text-white w-full">
              {loading ? "Loading..." : "Save Basic Information"}
            </button>
            {error && <p className="text-red-400">*Error: {error}</p>}
          </div>
        </form>

        <div className="mt-5 bg-white p-5">
          <h1 className="font-bold">Product Variant</h1>
          {product.product_iterations.map((pi, i) => (
            <form
              key={i}
              method="post"
              className="p-5 bg-white mt-5 border-2 border-cyan-200 relative"
            >
              <div className="absolute -top-2 -left-2">
                <div className="bg-red-500 text-white w-6 h-6 rounded-full">
                  <p className="text-center">{i + 1}</p>
                </div>
              </div>
              <h1 className="font-bold">Informasi Tambahan</h1>
              <div className="flex gap-2">
                {pi.product_variant_mapping.map((variant, i) => (
                  <div
                    key={i}
                    className="px-3 py-1 border-2 border-cyan-400 w-max"
                  >
                    <h1 className="text-xs text-black/50">
                      {variant.variant.varian_type.variant_type_name}
                    </h1>
                    <p className="text-cyan-700">
                      {variant.variant.variant_name}
                    </p>
                  </div>
                ))}
                <div
                  className="px-3 py-1 bg-cyan-400 text-white w-max flex items-center cursor-pointer"
                  onClick={() => {
                    setSelectedIterationId(pi.product_iteration_id);
                    setShowAddVariantModal(true);
                  }}
                >
                  <p>+</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <h1 className="font-bold">Harga (Rp)</h1>
                  <input
                    type="number"
                    name="product_variant_price"
                    className="px-5 py-2 w-full bg-white border-2 border-cyan-200 outline-none"
                    min={500}
                    max={16500000}
                    defaultValue={pi.product_variant_price}
                    required
                  />
                </div>
                <div>
                  <h1 className="font-bold">Stok</h1>
                  <input
                    type="number"
                    name="product_variant_stock"
                    className="px-5 py-2 w-full bg-white border-2 border-cyan-200 outline-none"
                    min={0}
                    max={16500000}
                    defaultValue={pi.product_variant_stock}
                    required
                  />
                </div>
                <div>
                  <h1 className="font-bold">Berat (kg)</h1>
                  <input
                    type="number"
                    name="product_variant_weight"
                    className="px-5 py-2 w-full bg-white border-2 border-cyan-200 outline-none"
                    min={0}
                    max={500000}
                    defaultValue={pi.product_variant_weight}
                    required
                  />
                </div>
              </div>
              <div className="mt-5">
                <button className="px-5 py-2 bg-cyan-400 text-white w-full">
                  {loading ? "Loading..." : `Save Variant ${i + 1}`}
                </button>
                {error && <p className="text-red-400">*Error: {error}</p>}
              </div>
            </form>
          ))}
        </div>

        <form method="post" className="p-5 bg-white mt-5">
          <h1 className="font-bold">Tambah Variant</h1>
        </form>
      </div>
    </>
  );
}
