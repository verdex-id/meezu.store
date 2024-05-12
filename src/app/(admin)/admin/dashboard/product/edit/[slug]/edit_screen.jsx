"use client";

import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
import AddVariantModal from "./add_variant_modal";
import AddIterationModal from "./add_iteration_modal";
import AddIterationImageModal from "./add_image_modal";
import Image from "next/image";

export default function AdminDashboardProductEditScreen({ product }) {
  const cookie = useCookies();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [showAddVariantModal, setShowAddVariantModal] = useState(false);
  const [showAddIterationModal, setShowAddIterationModal] = useState(false);
  const [showAddImageModal, setShowAddImageModal] = useState(false);

  const [selectedIterationId, setSelectedIterationId] = useState();
  const [showIterationImages, setShowIterationImages] = useState();
  const [iterationImages, setIterationImages] = useState([]);

  async function handleShowIterationImages(productIterationId) {
    setShowIterationImages(productIterationId);
    const res = await fetch(
      "/api/iteration_images?product_iteration_id=" + productIterationId
    ).then((r) => r.json());
    if (res.status == "success") {
      setIterationImages(res.data.iteration_images);
    }
  }

  async function handleEditBasicProduct(e) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch(`/api/products/${product.product_slug}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.get("access_token"),
      },
      body: JSON.stringify({
        new_product_name: formData.get("product_name"),
        new_product_description: formData.get("product_description"),
      }),
    }).then((r) => r.json());

    setLoading(false);

    if (res.status == "success") {
      setSuccess(true);
    } else {
      setSuccess(false);
      setError(res.message);
    }
  }

  async function handleEditIterationProduct(e, productIterationId) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch(`/api/product_iterations/${productIterationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.get("access_token"),
      },
      body: JSON.stringify({
        product_iteration_id: selectedIterationId,
        new_iteration_price: formData.get("product_variant_price"),
        new_iteration_stock: formData.get("product_variant_stock"),
        new_iteration_weight: formData.get("product_variant_weight"),
      }),
    }).then((r) => r.json());

    setLoading(false);

    if (res.status == "success") {
      setSuccess(true);
    } else {
      setSuccess(false);
      setError(res.message);
    }
  }

  async function handleDeleteIterationProduct(productIterationId) {
    setLoading(true);

    const res = await fetch(`/api/product_iterations/${productIterationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.get("access_token"),
      },
    }).then((r) => r.json());

    setLoading(false);

    if (res.status == "success") {
      setSuccess(true);
      window.location.reload();
    } else {
      setSuccess(false);
      setError(res.message);
    }
  }

  async function handleDeleteProduct() {
    setLoading(true);

    const res = await fetch(`/api/products/${product.product_slug}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.get("access_token"),
      },
    }).then((r) => r.json());

    setLoading(false);

    if (res.status == "success") {
      setSuccess(true);
      window.location.replace("/admin/dashboard/product");
    } else {
      setSuccess(false);
      setError(res.message);
    }
  }

  async function handleDeleteIterationImage(imageIterationId) {
    const res = await fetch("/api/iteration_images/" + imageIterationId, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + cookie.get("access_token"),
      },
    }).then((r) => r.json());

    if (res.status == "success") {
      window.location.reload();
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
      {showAddIterationModal && (
        <AddIterationModal
          setShowAddIterationModal={setShowAddIterationModal}
          productId={product.product_id}
        />
      )}
      {showAddImageModal && (
        <AddIterationImageModal
          productIterationId={selectedIterationId}
          setShowAddImageModal={setShowAddImageModal}
        />
      )}

      <div className="w-full max-w-screen-sm mx-auto px-8 min-h-dvh">
        <h1 className="font-bold text-xl">
          Edit Product {product.product_name}
        </h1>

        {success && (
          <div className="px-5 py-2 bg-white border-l-4 border-l-green-500">
            Success
          </div>
        )}

        {error && (
          <div className="px-5 py-2 bg-white border-l-4 border-l-red-500">
            Error: {error}
          </div>
        )}

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
          <button
            className="px-5 py-2 bg-cyan-400 text-white w-full"
            onClick={() => setShowAddIterationModal(true)}
          >
            Tambah Varian Baru
          </button>
          {product.product_iterations.map((pi, i) => (
            <div key={i}>
              <form
                method="post"
                className="p-5 bg-white mt-5 border-2 border-cyan-200 relative"
                onSubmit={(e) => {
                  handleEditIterationProduct(e, pi.product_iteration_id);
                }}
              >
                <div className="absolute -top-2 -left-2">
                  <div className="bg-red-500 text-white w-6 h-6 rounded-full">
                    <p className="text-center">{i + 1}</p>
                  </div>
                </div>
                <div>
                  <h1 className="font-bold">
                    Gambar (1:1){" "}
                    <span
                      onClick={() =>
                        handleShowIterationImages(pi.product_iteration_id)
                      }
                      className="text-cyan-700 font-normal cursor-pointer"
                    >
                      Show Images
                    </span>
                  </h1>
                  {showIterationImages == pi.product_iteration_id && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                      {iterationImages.map((image, i) => (
                        <div
                          key={i}
                          className="relative aspect-square border-2 border-cyan-400"
                        >
                          <Image
                            src={image.iteration_image_path}
                            fill
                            alt="Image"
                            className="object-cover"
                          />
                          <div
                            onClick={() =>
                              handleDeleteIterationImage(
                                image.iteration_image_id
                              )
                            }
                            className="text-red-400 absolute top-1 left-3 text-xs cursor-pointer"
                          >
                            Delete
                          </div>
                        </div>
                      ))}
                      <div
                        className="bg-cyan-400 text-white flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          setSelectedIterationId(pi.product_iteration_id);
                          setShowAddImageModal(true);
                        }}
                      >
                        <p className="text-xl">Tambah</p>
                      </div>
                    </div>
                  )}
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
                  <div className="flex gap-2">
                    <button className="px-5 py-2 bg-cyan-400 text-white w-full">
                      {loading ? "Loading..." : `Save Variant ${i + 1}`}
                    </button>
                    <button
                      type="reset"
                      className="px-5 py-2 bg-red-400 text-white w-full"
                      onClick={() =>
                        handleDeleteIterationProduct(pi.product_iteration_id)
                      }
                    >
                      {loading ? "Loading..." : `Delete Variant ${i + 1}`}
                    </button>
                  </div>
                  {error && <p className="text-red-400">*Error: {error}</p>}
                </div>
              </form>
            </div>
          ))}
        </div>

        <div className="mb-32">
          <button
            className="px-5 py-2 bg-red-400 text-white w-full mt-5"
            onClick={() => handleDeleteProduct()}
          >
            Delete Product
          </button>
        </div>
      </div>
    </>
  );
}
