import { requestTransaction } from "@/services/tripay";

export async function makeTransaction(
  request,
  merchanRef,
  amount,
  tripayItems,
) {
  const response = await requestTransaction(
    merchanRef,
    amount,
    request.payment_method,
    request.guest_full_name,
    request.guest_email,
    request.guest_phone_number,
    tripayItems,
    "",
  );

  if (!response.success) {
    return {
      transaction: null,
      error: new Error(response.message),
    };
  }

  return {
    transaction: response.data,
    error: null,
  };
}
