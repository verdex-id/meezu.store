"use client";

import { useCookies } from "next-client-cookies";
import { useState } from "react";

export default function AddVariantModal({
  productIterationId,
  setShowAddVariantModal,
}) {
  const cookie = useCookies();

  const [loading, setLoading] = useState(false);

  async function handleAddVariant(e) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/variants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.get("access_token"),
      },
      body: JSON.stringify({
        product_iteration_id: productIterationId,
        variant_type_name: formData.get("variant_type_name"),
        variant_name: formData.get("variant_name"),
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
            className="p-5 bg-white"
            method="post"
            onSubmit={handleAddVariant}
          >
            <h1 className="font-bold text-xl">Tambah Informasi</h1>
            <div>
              <h1 className="font-bold">Judul</h1>
              <input
                type="text"
                name="variant_type_name"
                placeholder="Contoh: Warna"
                className="px-5 py-2 border-2 border-cyan-200 w-full outline-none"
                minLength={3}
                maxLength={30}
                required
              />
            </div>
            <div>
              <h1 className="font-bold">Text</h1>
              <input
                type="text"
                name="variant_name"
                placeholder="Contoh: Putih"
                className="px-5 py-2 border-2 border-cyan-200 w-full outline-none"
                minLength={1}
                maxLength={30}
                required
              />
            </div>
            <div className="flex gap-2 mt-5">
              <button className="px-5 py-1 bg-cyan-400 text-white cursor-pointer">
                {loading ? "Loading..." : "Save"}
              </button>
              <div
                onClick={() => setShowAddVariantModal(false)}
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
