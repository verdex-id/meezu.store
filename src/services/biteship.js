const biteshipBaseURL = "https://api.biteship.com";

export async function mapsSingleSearch(searchInput) {
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

export async function mapsDoubleSearch(areaId) {
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
