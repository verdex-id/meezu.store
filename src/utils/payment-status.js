export const paymentStatus = {
  /**
   * Represents the payment status when it is unpaid.
   * This status indicates that the payment for the order has not been made.
   * @enum {string}
   */

  unpaid: "UNPAID",

  /**
   * Represents the payment status when it is paid.
   * This status indicates that the payment for the order has been successfully made.
   */
  paid: "PAID",

  /**
   * Represents the payment status when it has failed.
   * This status indicates that the payment for the order has failed.
   */
  failed: "FAILED",

  /**
   * Represents the payment status when it has expired.
   * This status indicates that the payment for the order has expired.
   */
  expired: "EXPIRED",

  /**
   * Represents the payment status when it has been refunded.
   * This status indicates that the payment for the order has been refunded.
   */
  refund: "REFUND",
};
