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
      <div className="p-5 bg-white">
        {tracking ? (
          <h1 className="font-bold">Tracking</h1>
        ) : (
          <p>Error: Order Not Found</p>
        )}
      </div>
    </div>
  );
}
