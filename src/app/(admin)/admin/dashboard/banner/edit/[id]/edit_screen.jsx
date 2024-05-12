"use client";

import { useCookies } from "next-client-cookies";
import { useState } from "react";
import Image from "next/image";

export default function BannerEditScreen({ banner }) {
  const cookie = useCookies();

  const [loading, setLoading] = useState(false);

  async function handleUpdate(e) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/banners/" + banner.banner_id, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + cookie.get("access_token"),
      },
      body: JSON.stringify({
        banner_url: formData.get("banner_url"),
      }),
    }).then((r) => r.json());

    setLoading(false);

    if (res.status == "success") {
      window.location.replace("/admin/dashboard/banner");
    }
  }

  async function handleDelete() {
    setLoading(true);

    const res = await fetch("/api/banners/" + banner.banner_id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + cookie.get("access_token"),
      },
    });

    setLoading(false);

    if (res.status == "success") {
      window.location.replace("/admin/dashboard/banner");
    }
  }
  return (
    <div className="w-full max-w-screen-xl mx-auto px-8 min-h-dvh">
      <form
        method="post"
        className="w-full max-w-screen-sm mx-auto p-5 bg-white"
        onSubmit={handleUpdate}
      >
        <h1 className="font-bold text-center">Edit Banner</h1>

        <div className="mt-5">
          <h1>Current Banner Image Preview</h1>
          <div className="relative w-full aspect-[4/1] border-2 border-cyan-400">
            <Image
              src={banner.banner_image_path}
              alt="Current Banner"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-5">
          <h1>Redirect URL</h1>
          <input
            type="text"
            placeholder="https://youtube.com/example"
            className="px-5 py-2 bg-white outline-none w-full border-2 border-cyan-400"
            name="banner_url"
            required
            value={banner.banner_url}
          />
        </div>

        <div className="mt-5 flex gap-2">
          <button className="px-5 py-2 bg-cyan-400 text-white">
            {loading ? "Loading..." : "Save"}
          </button>
          <button
            onClick={handleDelete}
            type="reset"
            className="px-5 py-2 bg-red-400 text-white"
          >
            {loading ? "Loading..." : "Delete"}
          </button>
        </div>
      </form>
    </div>
  );
}
