
const biteshipBaseURL = "https://api.biteship.com";

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
    .then((json) => json)
    .catch((err) => console.error("error:" + err));

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
    .then((json) => json)
    .catch((err) => console.error("error:" + err));

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
