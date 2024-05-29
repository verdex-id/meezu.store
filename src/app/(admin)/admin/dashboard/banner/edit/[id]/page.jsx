import { cookies } from "next/headers";
import BannerEditScreen from "./edit_screen";

async function getBannerById(id) {
  const cookie = cookies();
  const res = await fetch(process.env.BASE_URL + "/api/banners/" + id, {
    headers: {
      Authorization: "Bearer " + cookie.get("access_token"),
    },
  }).then((r) => r.json());

  return res.data.banner;
}

export default async function AdminDashboardBannerEdit({ params }) {
  const banner = await getBannerById(params.id);

  return <BannerEditScreen banner={banner} />;
}
