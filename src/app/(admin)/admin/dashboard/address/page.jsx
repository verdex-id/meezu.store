"use client";

import Select from "@/components/select";
import { useCookies } from "next-client-cookies";
import { useEffect, useState } from "react";

export default function AdminDashboardAddressPage() {
  const cookie = useCookies();

  const [areas, setAreas] = useState([]);
  const [areasSearchText, setAreasSearchText] = useState("");
  const [selectedArea, setSelectedArea] = useState();
  const [phone, setPhone] = useState("");
  const [currentAddress, setCurrentAddress] = useState();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getCurrentAddress() {
      const res = await fetch("/api/addresses/origin/1", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookie.get("access_token"),
        },
      }).then((r) => r.json());

      if (res.status == "success") {
        setCurrentAddress(res.data.address);
        setAreasSearchText(res.data.address.address);
      }
    }
    getCurrentAddress();
  }, []);

  useEffect(() => {
    setSelectedArea(areas[0]);
  }, [areas]);

  async function handleSearchAddress() {
    const res = await fetch(`/api/areas?input=${areasSearchText}`).then((r) =>
      r.json()
    );

    console.log(res);
    if (res.status == "success") {
      setAreas(res.data.areas);
    }
  }

  async function handleSaveAddress() {
    setLoading(true);
    setSuccess(false);

    if (!selectedArea) {
      setError("Area belum dipilih");
      return;
    }

    if (!currentAddress) {
      const res = await fetch("/api/addresses/origin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookie.get("access_token"),
        },
        body: JSON.stringify({
          area_id: selectedArea.id,
          address: selectedArea.name,
          phone_number: phone,
        }),
      }).then((r) => r.json());

      setLoading(false);

      if (res.status == "success") {
        setSuccess(true);
      }
    } else {
      console.log(selectedArea);
      const res = await fetch("/api/addresses/origin/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookie.get("access_token"),
        },
        body: JSON.stringify({
          new_area_id: selectedArea.id,
          new_address: selectedArea.name,
          new_phone_number: phone,
        }),
      }).then((r) => r.json());

      setLoading(false);

      if (res.status == "success") {
        setSuccess(true);
      }
    }
  }
  return (
    <>
      <div className="w-full max-w-screen-xl min-h-dvh mx-auto px-8">
        <h1 className="font-bold text-xl">Alamat Toko</h1>
        <p>Alamat ini untuk lokasi tempat asal pengiriman</p>

        <div className="mt-5">
          <h1 className="font-bold">Nomor HP</h1>
          <input
            type="text"
            className="p-5 bg-white outline-none w-full"
            placeholder="Nomor HP untuk pengiriman"
            onChange={(e) => setPhone(e.target.value)}
            defaultValue={currentAddress?.phone_number}
          />
        </div>

        <div className="mt-5">
          <h1 className="font-bold">Cari Alamat</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Masukkan kata kunci untuk mencari alamat"
              className="p-5 w-full outline-none bg-white"
              onChange={(e) => setAreasSearchText(e.target.value)}
              defaultValue={currentAddress?.address}
            />

            <button
              className="p-5 bg-cyan-400 text-white"
              onClick={handleSearchAddress}
            >
              Cari
            </button>
          </div>
        </div>

        <div className="mt-5">
          {areas.length > 0 && (
            <>
              <h1 className="font-bold">Pilih Alamat</h1>
              <Select>
                {areas.map((area, i) => (
                  <option
                    key={i}
                    value={area.id}
                    onClick={() => setSelectedArea(area)}
                  >
                    {area.name}
                  </option>
                ))}
              </Select>
            </>
          )}
        </div>

        {selectedArea && (
          <div className="p-5 bg-white mt-8">
            <h1 className="font-bold text-xl">Konfirmasi Alamat</h1>
            <h1>{selectedArea.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              <div>
                <h1 className="font-bold first-letter:uppercase">
                  {selectedArea.administrative_division_level_1_type}
                </h1>
                <h2>{selectedArea.administrative_division_level_1_name}</h2>
              </div>
              <div>
                <h1 className="font-bold first-letter:uppercase">
                  {selectedArea.administrative_division_level_2_type}
                </h1>
                <h2>{selectedArea.administrative_division_level_2_name}</h2>
              </div>
              <div>
                <h1 className="font-bold first-letter:uppercase">
                  {selectedArea.administrative_division_level_3_type}
                </h1>
                <h2>{selectedArea.administrative_division_level_3_name}</h2>
              </div>
              <div>
                <h1 className="font-bold first-letter:uppercase">
                  Postal Code
                </h1>
                <h2>{selectedArea.postal_code}</h2>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5">
          {success && (
            <div className="border-l-4 border-green-400 bg-white px-5 py-2 my-2">
              Berhasil!
            </div>
          )}
          {error && (
            <div className="border-l-4 border-red-400 bg-white px-5 py-2 my-2">
              Error! {error}
            </div>
          )}
          <button
            className="p-5 bg-cyan-400 text-white"
            onClick={() => handleSaveAddress()}
          >
            {loading ? "Loading..." : "Simpan Alamat"}
          </button>
        </div>
      </div>
    </>
  );
}
