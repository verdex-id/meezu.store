/**
 * Represents the order status when it is pending.
 * This status indicates that the order has been created but has not yet been processed.
 * @type {string}
 */
export const pending = "PENDING";

/**
 * Represents the order status when it is awaiting payment.
 * This status indicates that the order has been created and is awaiting payment from the customer.
 * @type {string}
 */
export const awaitingPayment = "AWAITING PAYMENT";

/**
 * Represents the order status when it is awaiting fulfillment.
 * This status indicates that the order has been paid for and is awaiting fulfillment, which includes packaging and preparation for shipment.
 * @type {string}
 */
export const awaitingFulfillment = "AWAITING FULFILLMENT";

/**
 * Represents the order status when it is awaiting shipment.
 * This status indicates that the order has been fulfilled and is awaiting pickup by the shipping carrier for delivery to the customer.
 * @type {string}
 */
export const awaitingShipment = "AWAITING SHIPMENT";

/**
 * Represents the order status when it is awaiting pickup.
 * This status indicates that the order has been shipped and is awaiting pickup by the customer or delivery to a designated location.
 * @type {string}
 */
export const awaitingPickup = "AWAITING PICKUP";

/**
 * Represents the order status when it is shipped.
 * This status indicates that the order has been picked up by the shipping carrier and is in transit to the customer.
 * @type {string}
 */
export const shipped = "SHIPPED";

/**
 * Represents the order status when it is cancelled.
 * This status indicates that the order has been cancelled either by the customer or by the merchant before fulfillment or shipment.
 * @type {string}
 */
export const cancelled = "CANCELLED";

/**
 * Represents the order status when it is refunded.
 * This status indicates that the order has been refunded either partially or fully to the customer.
 * @type {string}
 */
export const refunded = "REFUNDED";
