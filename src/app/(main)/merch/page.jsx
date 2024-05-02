"use client";

import Image from "next/image";
import Carousel from "@/components/carousel";
import Input from "@/components/input";
import Select from "@/components/select";
import SearchIcon from "@/icons/search";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MerchPage() {
  const [carousel, setCarousel] = useState([
    {
      title: "Promo 1",
      image:
        "https://yt3.googleusercontent.com/VcIVBcyUF5yBA_D7H4eEImf_iIy-V3QZjyvHBPGl1j98UXQuqQJ7_DOKXmmtEe27_mUh4L8nVg=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
    },
    {
      title: "Promo 2",
      image: "/banner/banner_1.png",
    },
    {
      title: "Promo 3",
      image: "/banner/banner_1.png",
    },
  ]);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [filteredProducts, setFilteredProducts] = useState(products);

  const [page, setPage] = useState(1);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSearch(event) {
    const filter = products.filter((p) =>
      p.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredProducts(filter);
  }

  useEffect(() => {
    async function getProducts() {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/products?page=${page}&limit=30`).then((r) =>
        r.json()
      );
      setLoading(false);
      if (res.status == "success") {
        setProducts(res.data.products);
        setFilteredProducts(res.data.products);
      } else {
        setError(res.message);
      }
    }
    getProducts();

    async function getCategories() {
      const res = await fetch("/api/products/categories");
      const body = await res.json();

      if (body.status == "success") setCategories(body.data.categories);
    }
    getCategories();
  }, []);

  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto px-8 mt-5 space-y-8 pb-96">
        <div>
          <Carousel data={carousel} />
        </div>
        <div>
          <div className="mx-auto">
            <div className="flex gap-2">
              <Input
                name={"search"}
                type={"text"}
                placeholder="Search..."
                icon={<SearchIcon className="w-6 text-black" />}
                onChange={handleSearch}
                wrapperClassName={"w-full"}
              />
              <Select id={"category"}>
                <option value="all">All</option>
                {categories?.map((category) => (
                  <>
                    <option
                      key={category.product_category_id}
                      value={category.product_category_slug}
                    >
                      {category.product_category_name}
                    </option>
                  </>
                ))}
              </Select>
            </div>
          </div>
        </div>
        <div>
          <h1 className="font-bold text-xl">
            {selectedCategory
              ? `Product Category: ${selectedCategory.product_category_name}`
              : `All Products (${filteredProducts.length} products)`}
          </h1>
          {loading && <p>Loading...</p>}
          {error && (
            <div className="px-5 py-2 border-l-4 border-red-400 bg-red-200">
              Error: {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredProducts?.map((product, i) => (
              <Link key={i} href={`/merch/${product.product_slug}`}>
                <div className="w-full max-w-sm mx-auto p-5 bg-white">
                  <div className="relative w-full aspect-video object-cover">
                    <Image
                      src={"/banner/banner_1.png"}
                      layout="fill"
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <h1 className="font-bold text-xl">
                      {product.product_name}
                    </h1>
                    <p>
                      Rp
                      {Intl.NumberFormat("id-ID").format(
                        product.product_iterations[0].product_variant_price
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
