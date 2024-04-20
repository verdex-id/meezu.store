import { requestTransaction } from "@/services/tripay";
import { FailError } from "@/utils/custom-error";

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
      error: new FailError(response.message, 400),
    };
  }

  return {
    transaction: response.data,
    error: null,
  };
}
