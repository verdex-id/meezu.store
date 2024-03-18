import Select from "@/components/select";
import prisma from "@/lib/prisma";
import { unsignedMediumInt, unsignedSmallInt } from "@/utils/size";
import Joi, { trace } from "joi";
import { NextResponse } from "next/server";

export async function POST(request) {
    const schema = Joi.object({
        discount_value: Joi.number()
            .min(1)
            .max(unsignedMediumInt)
            .integer()
            .required(),
        is_percent_discount: Joi.boolean().required(),
        maximum_discount_amount: Joi.number()
            .min(1000)
            .max(unsignedMediumInt)
            .integer()
            .required(),
        is_limited: Joi.boolean().required(),
        usage_limit: Joi.number().min(1).max(unsignedSmallInt),

        minimum_amount: Joi.number().min(1000).max(unsignedMediumInt).integer(),

        from_date: Joi.date().iso().min("now"),
        to_date: Joi.date().iso().greater(Joi.ref("from_date")),

        from_hour: Joi.number().integer().min(0).max(23),
        to_hour: Joi.number()
            .integer()
            .greater(Joi.ref("from_hour"))
            .min(0)
            .max(23),

        product_id: Joi.number().integer(),
    });

    const req = await request.json()

    const arg = {
        data: {
            discount_value: 10000,
            is_percent_discount: false,
            maximum_discount_amount: 15000,
            is_limited: true,
            usage_limits: 100,

        },
        select: {
            discount_value: true,
            is_percent_discount: true,
            maximum_discount_amount: true,
            is_limited: true,
            usage_limits: true,
            product_discount: { select: { product: { select: { product_id: true, product_slug: true, product_name: true, product_category: true } } } }


        }
    }
    if (!req.is_limited) {
        arg.usage_limits = 0
    }


    if (req.minimum_amount) {
        const createdThresholdDiscount = await prisma.thresholdDiscount.create({
            data: {
                minimum_amount: req.minimum_amount,
            },
            select: {
                threshold_discount_id: true,
            }
        })

        arg.data["threshold_discount_id"] = createdThresholdDiscount.threshold_discount_id
        arg.select["threshold_discount"] = "{ select: { minimum_amount: true } }"
    }

    if (req.from_date && req.to_date) {
        const createdLimitedTimeDiscount = await prisma.limitedTimeDiscount.create({
            data: {
                from_date: req.from_date,
                to_date: req.to_date
            },
            select: {
                limited_time_discount_id: true
            }
        })
        arg.data["limited_time_discount_id"] = createdLimitedTimeDiscount.limited_time_discount_id
        arg.select["limited_time_discount"] = "{ select: { from_date: true, to_date: true } }"
    }

    if (req.from_hour && req.to_hour) {
        const createdDailyDiscount = await prisma.dailyDiscount.create({
            data: {
                from_hour: req.from_hour,
                to_hour: req.to_hour
            },
            select: {
                daily_discount_id: true,
            }
        })

        arg.data["daily_discount_id"] = limited_time_discount_id
        arg.select["daily_discount"] = "{ select: { from_hour: true, to_hour: true } }"
    }

    const createdDiscount = await prisma.discount.create({
        data: {
            discount_value: 10000,
            is_percent_discount: false,
            maximum_discount_amount: 15000,
            is_limited: true,
            usage_limits: 100,

        },
        select: {
            discount_value: true,
            is_percent_discount: true,
            maximum_discount_amount: true,
            is_limited: true,
            usage_limits: true,
            product_discount: { select: { product: { select: { product_id: true, product_slug: true, product_name: true, product_category: true } } } }


        }
    })

    return NextResponse.json({ discount: createdDiscount })

}
