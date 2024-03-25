import prisma from "@/lib/prisma";
import { successResponse } from "@/utils/response";
import Joi from "joi";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
    const schema = Joi.object({
        new_iteration_price: Joi.number()
            .min(500)
            .max(16_500_000)
            .integer()
            .required(),
        new_iteration_stock: Joi.number().min(0).max(65_000).integer().required(),
        new_iteration_weight: Joi.number().max(500_000).integer().required(),
    });

    const req = await request.json();

    const invalidReq = schema.validate(req);
    if (invalidReq.error) {
        return NextResponse.json(
            ...failResponse("Invalid request format.", 403, invalidReq.error.details),
        );
    }

    const existingProduct = await prisma.product.findUnique({
        where: {
            product_slug: params.productSlug,
        },
        select: {
            product_id: true,
        },
    });

    const updatedProductIteration = await prisma.productIteration.update({
        where: {
            product_id: existingProduct.product_id,
            product_iteration_id: parseInt(params.iterationId),
        },
        data: {
            product_variant_price: parseInt(req.new_iteration_price),
            product_variant_stock: parseInt(req.new_iteration_stock),
            product_variant_weight: parseInt(req.new_iteration_weight),
        },
        select: {
            product_iteration_id: true,
            product_variant_price: true,
            product_variant_stock: true,
            product_variant_weight: true,
            product: {
                select: {
                    product_id: true,
                    product_slug: true,
                    product_name: true,
                },
            },
        },
    });

    return NextResponse.json(
        ...successResponse({ updated_product_iteration: updatedProductIteration }),
    );
}
