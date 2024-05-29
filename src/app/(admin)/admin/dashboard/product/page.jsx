import AdminDashboardProductScreen from "./products_screen";

async function getProducts(page) {
  const res = await fetch(
    process.env.BASE_URL + `/api/products/?page=${page}&limit=30`,
    {
      next: { revalidate: 10 },
    }
  ).then((r) => r.json());
  return res;
}

export default async function AdminDashboardProductPage(request) {
  const res = await getProducts(request.searchParams.page || 1);
  return (
    <AdminDashboardProductScreen
      products={res.data.products}
      page={request.searchParams.page || 1}
    />
  );
}
