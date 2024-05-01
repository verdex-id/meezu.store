"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import CardAdmin from "@/components/card_admin";
import { useState } from "react";
import { useCookies } from "next-client-cookies";

export default function DashboardPage() {
  const [variants, setVariants] = useState([]);
  const [tempVariantType, setTempVariantType] = useState();
  const [tempVariantName, setTempVariantName] = useState();

  const [productIteration, setProductIteration] = useState([]);
  const [tempProductIteration, setTempProductIteration] = useState();

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState();

  const [errors, setErrors] = useState();

  const cookie = useCookies();

  function handleSaveVariantOption() {
    if (!tempVariantType || !tempVariantName) {
      setErrors("Varian tidak valid");
    } else {
      const variant = variants.filter(
        (v) =>
          v.variant_type_name == tempVariantType &&
          v.variant_name == tempVariantName
      );
      if (variant.length > 0) {
        return;
      }
      setVariants([
        ...variants,
        { variant_type_name: tempVariantType, variant_name: tempVariantName },
      ]);
    }
  }

  function handleSaveVariant() {
    const product_iterations = { ...tempProductIteration, variants: variants };
    setProductIteration([...productIteration, product_iterations]);
  }

  async function handleSaveProduct() {
    setProducts({
      ...product,
      product_iterations: productIteration,
    });

    const accessToken = cookie.get("access_token");

    console.log(products);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(products),
    }).then((r) => r.json());
    console.log(res);
  }

  function handleDeleteIteration(pi) {
    const filteredIterations = productIteration.filter((p) => p != pi);
    setProductIteration(filteredIterations);
  }
  return (
    <>
      {/* Section Buat Produk */}
      <div className="w-full max-w-screen-xl mx-auto px-8 text-cyan-900">
        <h1 className="text-black font-baloo text-5xl mt-8">Buat Produk</h1>
        <div>
          <div>
            <h1 className="text-cyan-900 font-baloo text-2xl">Thumbnail</h1>
          </div>
          <div>
            <input
              type="file"
              name="product_image"
              id="product_image"
              className="p-5 bg-white border-none w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="col-span-2">
              <Input
                type={"text"}
                id={"product_name"}
                name={"product_name"}
                title={"Nama Produk"}
                placeholder="Nama Produk"
                onChange={(e) =>
                  setProduct({ ...product, product_name: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                type={"text"}
                id={"product_category_name"}
                name={"product_category_name"}
                title={"Kategori Produk"}
                placeholder="Kategori Produk"
                onChange={(e) =>
                  setProduct({
                    ...product,
                    product_category_name: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <Input
              type={"textarea"}
              id={"product_description"}
              name={"product_description"}
              title={"Deskripsi Produk"}
              placeholder="Deskripsi Produk"
              onChange={(e) =>
                setProduct({ ...product, product_description: e.target.value })
              }
            />
          </div>

          <div className="mt-2">
            <h1 className="font-bold text-3xl">Varian Produk</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {productIteration.map((p, i) => (
              <>
                <div
                  key={i}
                  className="mt-2 p-5 border-4 border-white max-w-sm"
                >
                  <div>
                    <div>Harga: Rp{p.product_variant_price}</div>
                    <div>Berat: {p.product_variant_weight}kg</div>
                    <div>Stok: {p.product_variant_stock}</div>
                  </div>

                  <div className="mt-2">
                    <h1 className="text-3xl font-bold">Opsi</h1>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {p.variants.map((v, i) => (
                      <>
                        <div key={i} className="px-3 py-1 bg-white text-xs">
                          <p>Tipe: {v.variant_type_name}</p>
                          <p>Nama: {v.variant_name}</p>
                        </div>
                      </>
                    ))}
                  </div>

                  <div
                    className="mt-5 px-5 py-1 bg-red-400 w-max text-white cursor-pointer"
                    onClick={() => handleDeleteIteration(p)}
                  >
                    Hapus
                  </div>
                </div>
              </>
            ))}
          </div>
          <div className="mt-2 p-5 border-4 border-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <Input
                  type={"number"}
                  id={"product_variant_price"}
                  name={"product_variant_price"}
                  title={"Harga Produk"}
                  placeholder="Harga Produk"
                  onChange={(e) =>
                    setTempProductIteration({
                      ...tempProductIteration,
                      product_variant_price: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Input
                  type={"number"}
                  id={"product_variant_weight"}
                  name={"product_variant_weight"}
                  title={"Berat Produk (kg)"}
                  placeholder="Berat Produk (kg)"
                  onChange={(e) =>
                    setTempProductIteration({
                      ...tempProductIteration,
                      product_variant_weight: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Input
                  type={"number"}
                  id={"product_variant_stock"}
                  name={"product_variant_stock"}
                  title={"Stok Produk"}
                  placeholder="Stok Produk"
                  onChange={(e) =>
                    setTempProductIteration({
                      ...tempProductIteration,
                      product_variant_stock: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="mt-2">
              <h1 className="text-3xl font-bold">Opsi</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              {variants.map((v, i) => (
                <>
                  <div key={i} className="px-3 py-1 bg-white text-xs">
                    <p>Tipe: {v.variant_type_name}</p>
                    <p>Nama: {v.variant_name}</p>
                  </div>
                </>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input
                type={"text"}
                id={"product_variant_type_name"}
                name={"product_variant_type_name"}
                placeholder="Tipe Varian (contoh: Ukuran)"
                onChange={(e) => setTempVariantType(e.target.value)}
              />
              <Input
                type={"text"}
                id={"product_variant_name"}
                name={"product_variant_name"}
                placeholder="Nama Varian (contoh: L)"
                onChange={(e) => setTempVariantName(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <div
                  className="p-5 bg-cyan-400 text-white !cursor-pointer text-center mt-1"
                  onClick={handleSaveVariantOption}
                >
                  <p>Tambah Varian</p>
                </div>
                <div
                  className="p-5 bg-red-400 text-white !cursor-pointer text-center mt-1"
                  onClick={() => setVariants([])}
                >
                  <p>Reset Varian</p>
                </div>
              </div>
              <div
                className="p-5 bg-cyan-400 text-white text-center cursor-pointer"
                onClick={handleSaveVariant}
              >
                Tambah Varian
              </div>
            </div>
          </div>
          <div className="mt-5">
            <Button type={5} onClick={handleSaveProduct}>
              Tambah Produk/Simpan
            </Button>
          </div>
        </div>
      </div>

      {/* Section Semua Produk */}
      <div className="mt-8 w-full max-w-screen-xl mx-auto px-8 text-cyan-900 pb-16">
        <h1 className="text-black font-baloo text-5xl">Semua Produk</h1>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {/* {dummydata.map((data, index) => (
              <CardAdmin
                key={index}
                image={data.image}
                title={data.title}
                price={data.price}
                discountPrice={data.discountPrice}
                sold={data.sold}
                productId={data.productId}
              />
            ))} */}
          </div>
        </div>
      </div>
    </>
  );
}
