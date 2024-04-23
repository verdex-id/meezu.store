import crypto from "crypto";

function closedPaymentSignature(merchantRef, amount) {
  const privateKey = process.env.TRIPAY_PRIVATE_KEY;
  const merchantCode = process.env.TRIPAY_MERCHANT_CODE;

  const data = merchantCode + merchantRef + amount;
  return crypto.createHmac("sha256", privateKey).update(data).digest("hex");
}

export function tripayCallbackSignature(requestJSON) {
  const privateKey = process.env.TRIPAY_PRIVATE_KEY;

  const signature = crypto
    .createHmac("sha256", privateKey)
    .update(requestJSON)
    .digest("hex");

  return signature;
}

let mode = "api-sandbox";
//if (process.env.NODE_ENV === "production") {
//  mode = "api";
//}
const tripayBaseURL = `https://tripay.co.id/${mode}`;

export async function requestClosedTransaction(
  merchantRef,
  amount,
  paymentMethod,
  customerName,
  customerEmail,
  customerPhone,
  tripayItems,
  returnUrl,
) {
  const apiKey = process.env.TRIPAY_API_KEY;
  const expiry =
    Math.floor(Date.now() / 1000) +
    process.env.TRIPAY_TRANSACTION_DURATION * 60 * 60;

  const signature = closedPaymentSignature(merchantRef, amount);

  const payload = {
    method: paymentMethod,
    merchant_ref: merchantRef,
    amount: amount,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    order_items: tripayItems,
    return_url: returnUrl,
    expired_time: expiry,
    signature: signature,
  };

  const response = await fetch(`${tripayBaseURL}/transaction/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((json) => json);

  return response;
}

export async function getDetailTransaction(transactionReference) {
  const apiKey = process.env.TRIPAY_API_KEY;

  const response = await fetch(
    `${tripayBaseURL}/transaction/detail?reference=${transactionReference}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    },
  )
    .then((res) => res.json())
    .then((json) => json);

  return response;
}
