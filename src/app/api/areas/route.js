import { retriveAreaSingleSearch } from "@/services/biteship";
import { failResponse, successResponse } from "@/utils/response";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function GET(request) {
  const schema = Joi.object({
    input: Joi.string()
      .pattern(/^[a-zA-Z0-9,. ]+$/)
      .required(),
  });

  const { searchParams } = new URL(request.url);
  const searchInput = searchParams.get("input");

  const validationResult = schema.validate({
    input: searchInput,
  });

  if (validationResult.error) {
    return NextResponse.json(
      ...failResponse(
        "Invalid request format.",
        403,
        validationResult.error.details
      )
    );
  }

  const areas = await retriveAreaSingleSearch(searchInput);

  if (areas.error) {
    return NextResponse.json(
      ...failResponse("Unable to find areas", 404, areas.error)
    );
  }

  return NextResponse.json(
    ...successResponse({
      areas: areas.areas,
    })
  );
}
