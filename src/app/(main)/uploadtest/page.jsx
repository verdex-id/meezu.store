"use client";

import { useState } from "react";
import Image from "next/image";

export default function UploadTest() {
  const [image, setImage] = useState();

  async function handleChangeImage(e) {
    setImage(e.target.files[0]);
  }

  async function handleUploadImage(e) {
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/upload/product_image/[iteration-id]", {
      method: "POST",
      body: formData,
    });
  }

  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto px-8 min-h-dvh">
        <form
          method="post"
          className="mt-5 w-full max-w-sm mx-auto"
          onSubmit={handleUploadImage}
        >
          <h1 className="font-bold">
            Gambar yang dipilih {image ? "Dibawah Ini" : "Belum Ada"}
          </h1>
          {image && (
            <div className="relative w-96 h-96 p-5 bg-white">
              <Image src={URL.createObjectURL(image)} fill alt="" />
            </div>
          )}
          <div className="p-5 bg-white mt-5">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChangeImage}
            />
            <button className="bg-cyan-400 px-5 py-2 text-white w-full mt-5">
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
