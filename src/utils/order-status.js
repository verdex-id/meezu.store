export const orderStatus = {
  /**
   * Represents the order status when it is incomplete.
   * This status indicates that some components of the order have not been completed by the buyer.
   * @type {string}
   */
  incomplete: "INCOMPLETE",

  /**
   * Represents the order status when it is awaiting payment.
   * This status indicates that the order has been created and is awaiting payment from the customer.
   * @type {string}
   */
  awaitingPayment: "AWAITING_PAYMENT",

  /**
   * Represents the order status when it is awaiting fulfillment.
   * This status indicates that the order has been paid for and is awaiting fulfillment, which includes packaging and preparation for shipment.
   * @type {string}
   */
  awaitingFulfillment: "AWAITING_FULFILLMENT",

  /**
   * Represents the order status when it is awaiting shipment.
   * This status indicates that the order has been fulfilled and is awaiting pickup by the shipping carrier for delivery to the customer.
   * @type {string}
   */
  awaitingShipment: "AWAITING_SHIPMENT",

  /**
   * Represents the order status when it is awaiting pickup.
   * This status indicates that the order has been shipped and is awaiting pickup by the customer or delivery to a designated location.
   * @type {string}
   */
  awaitingPickup: "AWAITING_PICKUP",

  /**
   * Represents the order status when it is shipped.
   * This status indicates that the order has been picked up by the shipping carrier and is in transit to the customer.
   * @type {string}
   */
  shipped: "SHIPPED",

  /**
   * Represents the order status when it has arrived at the destination.
   * @type {string}
   */
  arrived: "ARRIVED", 

  /**
   * Represents the order status when it has been completed by the user.
   * @type {string}
   */
  completed: "COMPLETED", 

  /**
   * Represents the order status when cancellation has been requested by the user.
   * @type {string}
   */
  cancellationRequest: "CANCELLATION_REQUEST", 

  /**
   * Represents the order status when the user is awaiting a refund.
   * @type {string}
   */
  awaitingRefund: "AWAITING_REFUND", 

  /**
   * Represents the order status when it is cancelled.
   * This status indicates that the order has been cancelled either by the customer or by the merchant before fulfillment or shipment.
   * @type {string}
   */
  cancelled: "CANCELLED",

  /**
   * Represents the order status when it is refunded.
   * This status indicates that the order has been refunded either partially or fully to the customer.
   * @type {string}
   */
  refunded: "REFUNDED",
};
