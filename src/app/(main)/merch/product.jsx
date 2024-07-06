"use client";
import Image from "next/image";
import Carousel from "@/components/carousel";
import Input from "@/components/input";
import Select from "@/components/select";
import SearchIcon from "@/icons/search";
import Link from "next/link";
import { useEffect, useState } from "react";
import ChevronDownIcon from "@/icons/chevron_down";

export default function ProductScreen({ products, page }) {
  const [banners, setBanners] = useState([]);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    async function getBanners() {
      const res = await fetch("/api/banners").then((r) => r.json());
      setBanners(res.data.banners);
    }
    getBanners();
  }, []);

  function handleSearch(event) {
    const filter = products.filter((p) =>
      p.product_name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredProducts(filter);
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-8 mt-5 space-y-8 pb-96">
      <div>
        <Carousel data={banners} />
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
        <div className="flex items-center gap-4 my-5">
          {page > 1 && (
            <Link href={`/merch?page=${page - 1}`} className="p-2 bg-white">
              <ChevronDownIcon className="w-6 rotate-90" />
            </Link>
          )}
          Page {page}
          <Link href={`/merch?page=${page + 1}`} className="p-2 bg-white">
            <ChevronDownIcon className="w-6 -rotate-90" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredProducts?.map((product, i) => (
            <Link key={i} href={`/merch/${product.product_slug}`}>
              <div className="w-full max-w-sm mx-auto p-5 bg-white">
                {product.product_iterations[0].iteration_images[0] && (
                  <div className="relative w-full aspect-square object-cover">
                    <Image
                      src={
                        product.product_iterations[0].iteration_images[0]
                          .iteration_image_path
                      }
                      layout="fill"
                      className="rounded-xl object-cover"
                    />
                  </div>
                )}
                <div>
                  <h1 className="font-bold text-xl">{product.product_name}</h1>
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
  );
}
