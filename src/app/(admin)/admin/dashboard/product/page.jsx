"use client";

import CardAdmin from "@/components/card_admin";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getProducts() {
      const res = await fetch(`/api/products?page=1&limit=30`).then((r) =>
        r.json()
      );
      console.log(res);
      setProducts(res.data.products);
    }
    getProducts();
  }, []);

  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto px-8">
        <Link
          href={"/admin/dashboard/product/new"}
          className="px-5 py-2 bg-cyan-400 block w-max text-white"
        >
          Add new Product
        </Link>
        <h1 className="mt-5">{products.length || 0} total products</h1>
        <hr className="border-2 border-cyan-700" />
        <div className="my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {products.map((product, i) => (
            <>
              <CardAdmin product={product} key={i} />
            </>
          ))}
        </div>
      </div>
    </>
  );
}
