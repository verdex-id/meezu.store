const biteshipBaseURL = "https://api.biteship.com";
import crypto from "crypto";

export function biteshipCallbackSignature(content) {
  const biteshipCallbackKey = process.env.BITESHIP_CALLBACK_SIGNATURE_KEY;

  const signature = crypto
    .createHmac("sha256", biteshipCallbackKey)
    .update(JSON.stringify(content))
    .digest("hex");

  return signature;
}

export async function createExpeditionOrder(
  originContactName,
  originContactPhone,
  originAddress,
  originNote,
  originAreaId,
  originPostalCode,

  destinationContactName,
  destinationContactPhone,
  destinationAddress,
  destinationContactEmail,
  destinationNote,
  destinationAreaId,
  destinationPostalCode,

  courierCompany,
  corierType,
  corierInsurance,
  deliveryType,
  deliveryDate,
  deliveryTime,
  orderNote,
  biteshipItems,
) {
  const url = `${biteshipBaseURL}/v1/orders`;

  const biteshipApiKey = process.env.BITESHIP_API_KEY;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${biteshipApiKey}`,
    },
    body: JSON.stringify({
      origin_contact_name: originContactName,
      origin_contact_phone: originContactPhone,
      origin_address: originAddress,
      origin_note: originNote,
      origin_area_id: originAreaId,
      origin_postal_code: originPostalCode,

      destination_contact_name: destinationContactName,
      destination_contact_phone: destinationContactPhone,
      destination_address: destinationAddress,
      destination_contact_email: destinationContactEmail,
      destination_note: destinationNote,
      destination_area_id: destinationAreaId,
      destination_postal_code: destinationPostalCode,

      courier_company: courierCompany,
      courier_type: corierType,
      courier_insurance: corierInsurance ? corierInsurance : null,
      delivery_type: deliveryType,
      delivery_date: deliveryDate,
      delivery_time: deliveryTime,
      order_note: orderNote,
      items: biteshipItems,
    }),
  };

  const response = await fetch(url, options)
    .then((res) => res.json())
    .then((json) => json);

  return response;
}

export async function courierTracking(courierTrackingId) {
  const options = {
    method: "GET",
    headers: {
      Authorization: process.env.BITESHIP_API_KEY,
    },
  };

  let response = await fetch(
    `https://api.biteship.com/v1/trackings/${courierTrackingId}`,
    options,
  )
    .then((response) => response.json())
    .then((response) => response);

  return response;
}

export async function retrieveCouriers() {
  const options = {
    method: "GET",
    headers: {
      Authorization: process.env.BITESHIP_API_KEY,
    },
  };

  let response = await fetch("https://api.biteship.com/v1/couriers", options)
    .then((response) => response.json())
    .then((response) => response);

  return response;
}

export async function retriveCourierRates(
  originAreaId,
  destinationAreaId,
  courierCode,
  biteshipItems,
) {
  const url = `${biteshipBaseURL}/v1/rates/couriers`;

  const biteshipApiKey = process.env.BITESHIP_API_KEY;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${biteshipApiKey}`,
    },
    body: JSON.stringify({
      origin_area_id: originAreaId,
      destination_area_id: destinationAreaId,
      couriers: courierCode,
      items: biteshipItems,
    }),
  };

  const response = await fetch(url, options)
    .then((res) => res.json())
    .then((json) => json);

  return response;
}

export async function retriveAreaSingleSearch(searchInput) {
  const url = `${biteshipBaseURL}/v1/maps/areas?countries=ID&input=${searchInput}&type=single`;

  const biteshipApiKey = process.env.BITESHIP_API_KEY;

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${biteshipApiKey}`,
    },
  };

  const response = await fetch(url, options)
    .then((res) => res.json())
    .then((json) => json);

  if (response.error) {
    return {
      areas: [],
      error: response.error,
    };
  }

  return {
    areas: response.areas,
    error: null,
  };
}

export async function retriveAreaDoubleSearch(areaId) {
  const url = `${biteshipBaseURL}/v1/maps/areas/${areaId}`;

  const biteshipApiKey = process.env.BITESHIP_API_KEY;

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${biteshipApiKey}`,
    },
  };

  const response = await fetch(url, options)
    .then((res) => res.json())
    .then((json) => json);

  if (response.error) {
    return {
      area: null,
      error: response.error,
    };
  }

  return {
    area: response.areas[0],
    error: null,
  };
}
