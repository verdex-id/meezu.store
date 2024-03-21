"use client";

import Card from "@/components/card";
import Carousel from "@/components/carousel";
import Input from "@/components/input";
import Select from "@/components/select";
import SearchIcon from "@/icons/search";
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
      image:
        "https://o-cdn-cas.sirclocdn.com/parenting/images/promo-ramadan-berkah.width-800.format-webp.webp",
    },
    {
      title: "Promo 3",
      image:
        "https://www.blibli.com/friends-backend/wp-content/uploads/2022/03/daftar-promo-ramadhan-2022-fix.jpg",
    },
  ]);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [filteredProducts, setFilteredProducts] = useState(products);

  function handleSearch(event) {
    const filter = products.filter((p) =>
      p.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredProducts(filter);
  }

  useEffect(() => {
    async function getProducts() {
      const res = await fetch("/api/products");
      const body = await res.json();

      if (body.status == "success") setProducts(body.data.products);
    }
    getProducts();

    async function getCategories() {
      const res = await fetch("/api/products/categories");
      const body = await res.json();

      if (body.status == "success") setCategories(body.data.categories);
    }
    getCategories();
  });

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredProducts?.map((product, i) => (
              <>
                <Card
                  image={
                    product.product_iterations[0].iteration_images[0]
                      .product_variant_image
                  }
                  price={product.product_iterations[0].product_variant_price}
                  sold={0}
                  title={product.product_name}
                />
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
