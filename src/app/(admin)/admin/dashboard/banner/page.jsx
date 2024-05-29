import Button from "@/components/button";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

async function getBanners() {
  const cookie = cookies();
  const res = await fetch(process.env.BASE_URL + "/api/banners", {
    headers: {
      Authorization: "Bearer " + cookie.get("access_token"),
    },
  }).then((r) => r.json());
  return res.data.banners;
}

export default async function BannerPage() {
  const banners = await getBanners();

  return (
    <>
      <div className="min-h-dvh w-full max-w-screen-xl mx-auto px-8 text-cyan-900">
        <h1 className="text-black font-baloo text-5xl mt-8 mb-8">
          Edit dan Post Banner
        </h1>
        <Link
          href={"/admin/dashboard/banner/new"}
          className="px-5 py-2 bg-cyan-400 text-white"
        >
          Add New Banner
        </Link>
        <div>
          <div className="mt-8 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {banners.map((data, index) => (
                <div key={index}>
                  <div className="mx-auto mt-5">
                    <div className="relative w-full aspect-[4/1]">
                      <Image
                        src={data.banner_image_path}
                        className="bg-cyan-400 object-cover"
                        fill
                      />
                    </div>
                    <div className="mt-2">
                      <Link
                        href={"/admin/dashboard/banner/edit/" + data.banner_id}
                        className="block w-full px-5 py-2 bg-cyan-400 text-white text-center"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
