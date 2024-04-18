import prisma from "@/lib/prisma";
import { retriveCourierRates } from "@/services/biteship";
import { FailError } from "@/utils/custom-error";
import { invoiceItemsListToBiteshipItemList } from "./order-items";

export async function makeShipment(tx, orderId, request, invoiceItems) {
  let activeOriginAddress;
  let selectedCourier;
  try {
    activeOriginAddress = await prisma.originAddress.findFirst({
      where: {
        is_active: true,
      },
    });

    if (!activeOriginAddress) {
      return {
        pricing: null,
        error: new FailError("Can't place an order for now", 503),
      };
    }

    selectedCourier = await prisma.courier.findFirst({
      where: {
        courier_id: parseInt(request.courier_id)
          ? parseInt(request.courier_id)
          : 0,
      },
    });

    if (!selectedCourier) {
      return {
        pricing: null,
        error: new FailError("Courier not available", 404),
      };
    }
  } catch (e) {
    return {
      pricing: null,
      error: e,
    };
  }

  const response = await retriveCourierRates(
    activeOriginAddress.area_id,
    request.guest_area_id,
    selectedCourier.courier_code,
    invoiceItemsListToBiteshipItemList(invoiceItems),
  );

  if (response.error) {
    if (response.code === 40001001 || response.code === 40001010) {
      return {
        pricing: null,
        error: new FailError(response.error, 404),
      };
    }
    return {
      pricing: null,
      error: new Error(),
    };
  }

  const pricing = response.pricing.find(
    (p) => p.courier_service_code === selectedCourier.courier_service_code,
  );

  if (!pricing) {
    return {
      pricing: null,
      error: new FailError("Courier not available", 404),
    };
  }
  await tx.shipment.create({
    data: {
      courier_id: selectedCourier.courier_id,
      order_id: orderId,
    },
  });

  return {
    pricing: pricing,
    error: null,
  };
}
