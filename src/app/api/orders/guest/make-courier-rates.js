import prisma from "@/lib/prisma";
import { retriveCourierRates } from "@/services/biteship";

export async function makeCourierRates(request, biteshipItems) {
  let activeOriginAddress;
  let selectedCourier;
  try {
    activeOriginAddress = await prisma.originAddress.findFirst({
      where: {
        is_active: true,
      },
    });

    if (!activeOriginAddress) {
      throw new FailError("Can't place an order for now", 503);
    }

    selectedCourier = await prisma.courier.findFirst({
      where: {
        courier_id: parseInt(request.courier_id)
          ? parseInt(request.courier_id)
          : 0,
      },
    });

    if (!selectedCourier) {
      throw new FailError("Courier not available", 404);
    }
  } catch (e) {
    return {
      origin: null,
      courier: null,
      pricing: null,
      error: e,
    };
  }

  const response = await retriveCourierRates(
    activeOriginAddress.area_id,
    request.guest_area_id,
    selectedCourier.courier_code,
    biteshipItems,
  );

  if (response.error) {
    if (response.code === 40001001 || response.code === 40001010) {
      return {
        origin: null,
        pricing: null,
        error: new FailError(response.error, 404),
      };
    }
    return {
      origin: null,
      courier: null,
      pricing: null,
      error: new Error(),
    };
  }

  const pricing = response.pricing.find(
    (p) => p.courier_service_code === selectedCourier.courier_service_code,
  );

  if (!pricing) {
    return {
      origin: null,
      courier: null,
      pricing: null,
      error: new FailError("Courier not available", 404),
    };
  }

  return {
    origin: activeOriginAddress,
    courier: selectedCourier,
    pricing: pricing,
    error: null,
  };
}
