import AdminVoucherScreen from "./voucher_screen";

async function getVouchers() {
  const res = await fetch(process.env.BASE_URL + "/api/vouchers").then((r) =>
    r.json()
  );
  return res.data.vouchers;
}

export default async function AdminDashboardVoucherPage() {
  const vouchers = await getVouchers();
  return <AdminVoucherScreen vouchers={vouchers} />;
}
