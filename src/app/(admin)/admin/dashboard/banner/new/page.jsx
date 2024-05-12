"use client";

import { useState } from "react";
import Image from "next/image";
import { useCookies } from "next-client-cookies";

export default function AdminDashboardBannerNew() {
  const cookie = useCookies();

  const [image, setImage] = useState();
  const [bannerUrl, setBannerUrl] = useState();

  const [loading, setLoading] = useState(false);

  async function handleChangeImage(e) {
    setImage(e.target.files[0]);
  }

  async function handleUploadImage(e) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/banners", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + cookie.get("access_token"),
      },
      body: formData,
    }).then((r) => r.json());

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
        onSubmit={handleUploadImage}
      >
        <h1 className="font-bold text-center">Add New Banner</h1>

        {image && (
          <div className="relative w-full aspect-[4/1] border-2 border-cyan-400 mt-5">
            <Image
              src={URL.createObjectURL(image)}
              alt="Banner"
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-5">
          <h1>Banner Image (4:1)</h1>
          <input
            type="file"
            name="image_file"
            className="px-5 py-2 bg-white outline-none w-full border-2 border-cyan-400"
            accept="image/*"
            required
            onChange={handleChangeImage}
          />
        </div>

        <div className="mt-5">
          <button className="px-5 py-2 bg-cyan-400 text-white">
            {loading ? "Loading..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
