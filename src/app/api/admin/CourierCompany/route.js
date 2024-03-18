import prisma from "@/lib/prisma";
import { failResponse, successResponse } from "@/utils/response";
import Joi, { func } from "joi";
import { NextResponse } from "next/server";

export async function POST(request) {
  const schema = Joi.object({
    courier_company_name: Joi.string()
      .pattern(/^[A-Za-z\s']+$/)
      .min(3)
      .required(),
  });

  const req = await request.json();
  const invalidReq = schema.validate(req);
  if (invalidReq.error) {
    return NextResponse.json(
      ...failResponse("invalid request format.", 403, invalidReq.error.details)
    );
  }

  const Courier_Company = await prisma.CourierCompany.create({
    data: {
      courier_company_name: req.courier_company_name,
    },
  });

  return NextResponse.json(...successResponse(Courier_Company));
}

export async function PUT(request) {
  const schema = Joi.object({
    courier_company_name: Joi.string().required(),
    new_courier_company_name: Joi.string()
      .pattern(/^[A-Za-z\s']+$/)
      .min(3)
      .required(),
  });

  const req = await request.json();

  const New_Courier_Company = await prisma.CourierCompany.update({
    where: {
      courier_company_name: req.courier_company_name,
    },
    data: {
      courier_company_name: req.new_courier_company_name,
    },
  });

  return NextResponse.json(...successResponse(New_Courier_Company));
}

export async function  DELETE(request){
    const schema = Joi.object({
        courier_company_name:Joi.string().required(),
    });
    const req=await request.json();

    const Delete_Courier_Company= await prisma.CourierCompany.delete({
        where:{
            courier_company_name:req.courier_company_name
        }
    });

    return NextResponse.json(...successResponse(Delete_Courier_Company));
}
