import { requestClosedTransaction } from "@/services/tripay";
import { FailError } from "@/utils/custom-error";

export async function makeTransaction(
    order,
    paymentMethod,
    amount,
    tripayItems,
) {
    const response = await requestClosedTransaction(
        order.order_code,
        amount,
        paymentMethod,
        order.invoice.guest_full_name,
        order.invoice.guest_email,
        order.invoice.guest_phone_number,
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
