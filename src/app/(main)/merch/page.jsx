import ProductScreen from "./product";

async function getProducts(page) {
  const res = await fetch(
    process.env.BASE_URL + `/api/products?page=${page}&limit=30`,
    { next: { revalidate: 0 } }
  ).then((r) => r.json());
  return res;
}

export default async function MerchPage(req) {
  const page = req.searchParams.page;
  const res = await getProducts(page || 1);

  return (
    <>
      <ProductScreen products={res.data.products} page={Number(page) || 1} />
    </>
  );
}
