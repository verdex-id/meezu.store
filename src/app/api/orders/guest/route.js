import prisma from "@/lib/prisma";
import Joi from "joi";

export async function POST(request) {
    const schema = Joi.object({
        guest_full_name: Joi.string(),
        guest_phone_number: Joi.string(),
        guest_email: Joi.string(),
        guest_address: Joi.string(),
        discount_code: Joi.string(),
        payment_method: Joi.string(),
        courier_service_code: Joi.string(),
        order_items: Joi.array(Joi.object({
            product_iteration_id: Joi.string(),
            order_item_quantity: Joi.string(),
        }))
    })


    const createdOrder = await prisma.order.create({})




}
