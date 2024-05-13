import PaymentScreen from "./payment_screen";

async function getOrder(orderCode) {
  const res = await fetch(
    process.env.BASE_URL + `/api/orders?order_code=${orderCode}`,
    { next: { revalidate: 0 } }
  ).then((r) => r.json());

  if (res.status == "success") {
    return res.data.order;
  }
}

async function getPayment(reference) {
  const res = await fetch(process.env.BASE_URL + `/api/payment/${reference}`, {
    next: { revalidate: 0 },
  }).then((r) => r.json());
  return res.data;
}

export default async function PaymentPage({ params }) {
  const order = await getOrder(params.orderCode);

  if (order) {
    const payment = await getPayment(order.payment.paygate_transaction_id);
    return (
      <PaymentScreen
        order={order}
        payment={payment.payment}
        instruction={payment.instruction}
      />
    );
  } else {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-8 min-h-dvh mt-8">
        Error: Order Not Found
      </div>
    );
  }
}
