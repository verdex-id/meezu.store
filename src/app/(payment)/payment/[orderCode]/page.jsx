import PaymentScreen from "./payment_screen";

async function getOrder(orderCode) {
  const res = await fetch(
    process.env.BASE_URL + `/api/orders?order_code=${orderCode}`,
    { next: { revalidate: 0 } }
  ).then((r) => r.json());
  return res.data.order;
}

async function getPayment(reference) {
  const res = await fetch(process.env.BASE_URL + `/api/payment/${reference}`, {
    next: { revalidate: 0 },
  }).then((r) => r.json());
  return res.data;
}

export default async function PaymentPage({ params }) {
  const order = await getOrder(params.orderCode);
  const payment = await getPayment(order.payment.paygate_transaction_id);
  return (
    <PaymentScreen
      order={order}
      payment={payment.payment}
      instruction={payment.instruction}
    />
  );
}
