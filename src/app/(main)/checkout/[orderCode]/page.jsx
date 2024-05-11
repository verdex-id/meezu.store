import SelectPaymentScreen from "./select_payment_screen";

async function getOrderByCode(code) {
  const res = await fetch(
    process.env.BASE_URL + `/api/orders?order_code=${code}`,
    {
      next: { revalidate: 1 },
    }
  ).then((r) => r.json());
  return res.data.order;
}

export default async function CheckoutOrderPaymentPage({ params }) {
  const order = await getOrderByCode(params.orderCode);

  return <SelectPaymentScreen order={order} />;
}
