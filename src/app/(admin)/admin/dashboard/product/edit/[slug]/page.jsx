import AdminDashboardProductEditScreen from "./edit_screen";

async function getProduct(slug) {
  const res = await fetch(process.env.BASE_URL + `/api/products/${slug}`, {
    next: { revalidate: 0 },
  }).then((r) => r.json());
  return res;
}

export default async function AdminDashboardProductEditPage({ params }) {
  const res = await getProduct(params.slug);
  if (res.status == "fail") {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-8 min-h-dvh">
        <p>Error: {res.message}</p>
      </div>
    );
  }
  return <AdminDashboardProductEditScreen product={res.data.product} />;
}
