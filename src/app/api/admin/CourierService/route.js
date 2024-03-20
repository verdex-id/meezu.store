import prisma from "@/lib/prisma";
import { failResponse, successResponse } from "@/utils/response";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function POST(request) {
  const schema = Joi.object({
    courier_service_name: Joi.string()
      .pattern(/^[A-Za-z\s' ]+$/)
      .min(3)
      .required(),
    courier_service_code: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9 ]{3,30}$"))
      .min(6)
      .required(),
    courier_company_id: Joi.number().required(),
  });

  const req = await request.json();
  const invalidReq = schema.validate(req);
  if (invalidReq.error) {
    return NextResponse.json(
      ...failResponse("invalid request format.", 403, invalidReq.error.details)
    );
  }

  const Courier_Service = await prisma.CourierService.create({
    data: {
      courier_service_name: req.courier_service_name,
      courier_service_code: req.courier_service_code,
      courier_company_id: req.courier_company_id,
    },
  });

  return NextResponse.json(...successResponse(Courier_Service));
}

export async function PUT(request) {
  const schema = Joi.object({
    id: Joi.number().required(), 
    courier_service_name: Joi.string().required(),
    new_courier_service_name: Joi.string()
      .pattern(/^[A-Za-z\s']+$/)
      .min(3)
      .required(),
    courier_service_code: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9 ]{3,30}$"))
      .min(6)
      .required(),
    courier_company_id: Joi.number().required(),
  });

  const req = await request.json();

  const New_Courier_Service = await prisma.CourierService.update({
    where: {
      id: req.id,
    },
    data: {
      courier_service_name: req.new_courier_service_name,
      courier_service_code: req.courier_service_code,
      courier_company_id: req.courier_company_id,
    },
  });

  return NextResponse.json(...successResponse(New_Courier_Service));
}

export async function DELETE(request) {
  const schema = Joi.object({
    id: Joi.number().required(),
    courier_service_name: Joi.string().required(),
  });

  const req = await request.json();

  const Delete_Courier_Service = await prisma.CourierService.delete({
    where: {
      id: req.id,
      courier_service_name: req.courier_service_name, 
    },
  });

  return NextResponse.json(...successResponse(Delete_Courier_Service));
}

