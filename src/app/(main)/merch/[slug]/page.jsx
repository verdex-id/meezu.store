import Review from "@/components/review";
import ProductDetailScreen from "@/components/screen/product_detail";

async function getProduct(slug) {
  const res = await fetch(process.env.BASE_URL + `/api/products/${slug}`).then(
    (r) => r.json()
  );
  return res;
}

export default async function MerchDetail({ params }) {
  const res = await getProduct(params.slug);
  return (
    <>
      {res.status == "fail" && (
        <div className="w-full max-w-screen-xl mx-auto min-h-dvh px-8 mt-5">
          <p>
            Product <span className="bg-red-200 px-2">{params.slug}</span> tidak
            ditemukan.
          </p>
        </div>
      )}

      {res.status == "success" && (
        <ProductDetailScreen product={res.data.product} />
      )}
    </>
  );
}
