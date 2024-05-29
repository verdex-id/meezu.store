"use client";

import { useCookies } from "next-client-cookies";
import { useState } from "react";

export default function AddIterationModal({
  setShowAddIterationModal,
  productId,
}) {
  const cookie = useCookies();

  const [loading, setLoading] = useState(false);

  async function handleAddIteration(e) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/product_iterations/new_iteration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.get("access_token"),
      },
      body: JSON.stringify({
        product_id: productId,
        product_variant_weight: formData.get("product_variant_weight"),
        product_variant_price: formData.get("product_variant_price"),
        product_variant_stock: formData.get("product_variant_stock"),
      }),
    }).then((r) => r.json());

    if (res.status == "success") {
      window.location.reload();
    }

    setLoading(false);
  }
  return (
    <div className="fixed top-0 left-0 w-full min-h-dvh bg-black/50 z-50">
      <div className="flex min-h-dvh items-center justify-center">
        <div className="w-full max-w-screen-sm">
          <form
            method="post"
            className="p-5 bg-white"
            onSubmit={handleAddIteration}
          >
            <h1 className="font-bold text-xl">Tambah Varian</h1>
            <p>Informasi Tambahan dapat ditambahkan setelah membuat ini.</p>
            <div>
              <h1 className="font-bold">Harga (Rp)</h1>
              <input
                type="number"
                name="product_variant_price"
                placeholder="Contoh: 10000"
                className="px-5 py-2 border-2 border-cyan-200 w-full outline-none"
                minLength={500}
                maxLength={16500000}
                required
              />
            </div>
            <div>
              <h1 className="font-bold">Stok</h1>
              <input
                type="number"
                name="product_variant_stock"
                placeholder="Contoh: 10"
                className="px-5 py-2 border-2 border-cyan-200 w-full outline-none"
                minLength={0}
                maxLength={65000}
                required
              />
            </div>
            <div>
              <h1 className="font-bold">Berat (gram)</h1>
              <input
                type="number"
                name="product_variant_weight"
                placeholder="Contoh: 100"
                className="px-5 py-2 border-2 border-cyan-200 w-full outline-none"
                minLength={0}
                maxLength={500000}
                required
              />
            </div>
            <div className="mt-5 flex gap-2">
              <button className="px-5 py-1 bg-cyan-400 text-white cursor-pointer">
                {loading ? "Loading..." : "Save"}
              </button>
              <div
                onClick={() => setShowAddIterationModal(false)}
                className="px-5 py-1 bg-red-400 text-white cursor-pointer"
              >
                Exit
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
