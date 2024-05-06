import ProductScreen from "./product";

async function getProducts(page) {
  const res = await fetch(
    process.env.BASE_URL + `/api/products?page=${page}&limit=30`,
    { next: { revalidate: 10 } }
  ).then((r) => r.json());
  return res;
}

export default async function MerchPage() {
  const res = await getProducts(1);

  return (
    <>
      <ProductScreen products={res.data.products} />
    </>
  );
}
