"use client";

import Card from "@/components/card";
import Carousel from "@/components/carousel";
import Input from "@/components/input";
import SearchIcon from "@/icons/search";
import { useState } from "react";

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

  const [products, setProducts] = useState([
    {
      title: "JKT48 New Era T-Shirt",
      description: "Description here...",
      price: 179000,
      sold: 48,
      image:
        "https://down-id.img.susercontent.com/file/531d3b57b1733fa6a8e5f549d73c6cee_tn",
    },
    {
      title: "B-Day T-Shirt Ella JKT48",
      description: "Description here...",
      price: 129000,
      discount_price: 99000,
      sold: 72,
      image: "https://pbs.twimg.com/media/Fzrhw0baQAATx_a.jpg:large",
    },
  ]);

  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto px-8 mt-5 space-y-8 pb-96">
        <div>
          <Carousel data={carousel} />
        </div>
        <div>
          <div className="mx-auto">
            <Input
              name={"search"}
              type={"text"}
              placeholder="Search..."
              icon={<SearchIcon className="w-6 text-black" />}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product, i) => (
            <>
              <Card
                image={product.image}
                price={product.price}
                discountPrice={product.discount_price}
                sold={product.sold}
                title={product.title}
              />
            </>
          ))}
        </div>
      </div>
    </>
  );
}
