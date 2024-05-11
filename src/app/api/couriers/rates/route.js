import { prismaErrorCode } from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import { prepareData } from "./prepare-data";
import { makeCourierRates } from "./make-courier-rates";
import { cetak } from "@/utils/cetak";
import Joi from "joi";

export async function POST(request) {
  let pricing;
  try {
    const schema = Joi.object({
      guest_area_id: Joi.string().required(),
      courier_id: Joi.string(),
      order_items: Joi.array().items(
        Joi.object({
          product_iteration_id: Joi.number().integer().min(0).required(),
          quantity: Joi.number().integer().min(1).required(),
        }),
      ),
    });

    let req = await request.json();
    req = schema.validate(req);
    if (req.error) {
      throw new FailError("invalid request format", 400, req.error.details);
    }
    req = req.value;

    const datas = await prepareData(req);
    if (datas.error) {
      throw datas.error;
    }

    let { biteshipItems } = datas.datas;

    pricing = await makeCourierRates(req, biteshipItems);
    if (pricing.error) {
      throw pricing.error;
    }
    pricing = pricing.pricing;
    cetak(pricing);
  } catch (e) {
    console.log(e);
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return NextResponse.json(
          ...failResponse(`${e.meta.modelName} not found`, 404),
        );
      }
      return NextResponse.json(
        ...failResponse(prismaErrorCode[e.code], 409, e.meta.modelName),
      );
    }

    if (e instanceof FailError) {
      return NextResponse.json(...failResponse(e.message, e.code, e.detail));
    }

    return NextResponse.json(...errorResponse());
  }
  return NextResponse.json(
    ...successResponse({
      pricing: {
        courier_name: pricing.courier_name,
        courier_service_name: pricing.courier_service_name,
        description: pricing.description,
        duration: pricing.duration,
        price: pricing.price,
      },
    }),
  );
}
