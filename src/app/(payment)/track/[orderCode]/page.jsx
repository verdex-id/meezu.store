import Image from "next/image";
import Link from "next/link";

async function getTracking(orderCode) {
  const res = await fetch(
    process.env.BASE_URL + "/api/couriers/tracking?order_code=" + orderCode
  ).then((r) => r.json());
  if (res.status == "success") {
    return res.data.tracking;
  }
}

export default async function TrackOrderPage({ params }) {
  const tracking = await getTracking(params.orderCode);
  return (
    <div className="w-full max-w-screen-sm mx-auto px-8 min-h-dvh pb-96 mt-8">
      <Link href={"/"} className="p-5 bg-white relative h-24 block">
        <Image
          src={"/logo/logo_meezu.png"}
          fill
          className="object-contain"
          alt="Logo"
        />
      </Link>
      <div className="p-5 bg-white mt-5">
        {tracking ? (
          <>
            <h1 className="font-bold font-mono text-center">
              Tracking {tracking.waybill_id}
            </h1>
            <h2 className="text-center text-xl">
              Status{" "}
              <span className="uppercase font-medium">{tracking.status}</span>
            </h2>
            <div className="p-5 bg-slate-100 mt-2">
              <h1 className="font-medium">Informasi Kurir</h1>
              <p className="text-sm">
                {tracking.courier.company.toUpperCase()} -{" "}
                {tracking.courier.driver_name} ({tracking.courier.driver_phone})
              </p>
            </div>
            <div className="p-5 bg-slate-100 mt-2">
              <h1 className="font-medium">Alamat Pengiriman</h1>
              <p className="text-sm">{tracking.destination.contact_name}</p>
              <p>{tracking.destination.address}</p>
            </div>
            <div className="p-5 bg-slate-100 mt-2">
              <h1 className="font-medium">Riwayat Pengiriman</h1>
              {tracking.history.map((history, i) => (
                <div
                  key={i}
                  className="px-5 py-2 bg-white border-2 border-slate-200 my-2"
                >
                  <h1 className="font-medium">
                    {history.service_type.toUpperCase()} -{" "}
                    {history.status.toUpperCase().replace("_", " ")}
                  </h1>
                  <p>{history.note}</p>
                  <p className="text-xs text-slate-700">{history.updated_at}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Error: Pesanan belum dikirim atau Pesanan tidak ditemukan</p>
        )}
      </div>
    </div>
  );
}
