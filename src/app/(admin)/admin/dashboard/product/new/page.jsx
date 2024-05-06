"use client";

import { useState } from "react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";

export default function AdminDashboardProductNewPage() {
  const cookie = useCookies();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [slug, setSlug] = useState("");

  async function handleCreateProduct(e) {
    e.preventDefault();

    setLoading(true);
    setSuccess(false);

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
      setSlug(res.data.created_product.product_slug);
      setSuccess(true);
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
      <div className="w-full max-w-screen-sm mx-auto px-8 min-h-dvh">
        <h1 className="font-bold text-xl">Add New Product</h1>
        <p>
          Tambahkan basic product disini, setelah itu akan diarahkan ke halaman
          Edit untuk menambahkan{" "}
          <span className="px-2 bg-cyan-300 text-white">Varian</span> dan
          sebagainya.
        </p>

        <form
          method="post"
          className="p-5 bg-white mt-5"
          onSubmit={handleCreateProduct}
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
                required
              />
            </div>
            <div>
              <h1 className="font-bold">Nama Kategori</h1>
              <input
                type="text"
                name="product_category_name"
                placeholder="Contoh: Baju"
                className="px-5 py-2 w-full bg-white border-2 border-cyan-200 outline-none"
                min={3}
                max={50}
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
              required
            ></textarea>
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
                defaultValue={500}
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
                defaultValue={1}
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
                defaultValue={0}
                required
              />
            </div>
          </div>
          <div className="mt-5">
            <button className="px-5 py-2 bg-cyan-400 text-white w-full">
              {loading ? "Loading..." : "Next"}
            </button>
            {error && <p className="text-red-400">*Error: {error}</p>}
            {success && (
              <p className="text-cyan-700">
                Berhasil! Anda akan di redirect ke halaman{" "}
                <Link
                  href={`/admin/dashboard/product/edit/${slug}`}
                  className="px-2 bg-cyan-400 text-white"
                >
                  edit
                </Link>
              </p>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
