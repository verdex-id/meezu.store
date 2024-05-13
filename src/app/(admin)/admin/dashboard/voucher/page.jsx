import AdminVoucherScreen from "./voucher_screen";

async function getVouchers() {
  const res = await fetch(process.env.BASE_URL + "/api/discounts", {
    next: { revalidate: 0 },
  }).then((r) => r.json());
  return res.data.discounts;
}

export default async function AdminDashboardVoucherPage() {
  const vouchers = await getVouchers();
  return <AdminVoucherScreen vouchers={vouchers} />;
}
