
import prisma, { prismaErrorCode } from "@/lib/prisma";
import { FailError } from "@/utils/custom-error";
import Joi from "joi";
import { makeDiscount } from "./make-discount";
import { makeTransaction } from "./make-transaction";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const schema = Joi.object({
            order_code: Joi.string()
                .pattern(/^[A-Z0-9-]{27,}$/)
                .required(),
            payment_method: Joi.string().pattern(/^[A-Z_]+$/).required(),
            discount_code: Joi.string().required(),
        });

        const { searchParams } = new URL(request.url);
        const orderCode = searchParams.get("order_code");


        let req = await request.json()

        req = schema.validate({
            order_code: orderCode,
            ...req
        });
        if (req.error) {
            throw new FailError(
                "Invalid request format",
                403,
                validationResult.error.details,
            )
        }
        req = req.value

        const order = await prisma.order.findUnique({
            where: {
                order_code: req.order_code,
            },
            select: {
                order_code: true,
                invoice: {
                    select: {
                        invoice_id: true,
                        gross_price: true,
                        invoice_item: true,
                    }
                }
            }
        })

        //tripay itesm
        //productIterationbulupdatequesry
        //productiterationbulkpupdatevalues


        let updatedInvoice;
        let tripayTransaction;
        await prisma.$transaction(async (tx) => {

            const affected = await tx.$executeRawUnsafe(
                prouductIterationBulkUpdateQuery,
                ...prouductIterationBulkUpdateValues
            );
            if (affected !== invoiceItems.length) {
                throw new FailError("Several records not found for update", 404);
            }

            let discount = 0;
            if (req.discount_code) {
                discount = await makeDiscount(tx, req.discount_code, order.invoice.gross_price);

                if (discount.error) {
                    throw discount.error;
                }

                discount = discount.amount;

                tripayItems.push({
                    name: "Discount",
                    price: -discount,
                    quantity: 1,
                });
            }


            const netPrice = grossPrice - discount;

            updatedInvoice = await tx.invoice.update({
                where: {
                    invoice_id: order.invoice.invoice_id
                },
                data: {
                    discount_amount: discount,
                    net_price: netPrice,
                }
            })

            tripayTransaction = await makeTransaction(
                order,
                req.payment_method,
                netPrice,
                tripayItems
            );
            if (tripayTransaction.error) {
                throw new FailError(
                    "There was an error processing your payment. Please try again later or contact support for assistance.",
                    500
                );
            }
        })

        await prisma.payment.create({
            data: {
                paygate_transaction_id: tripayTransaction.transaction.reference,
                payment_method: tripayTransaction.transaction.payment_method,
                order_id: createdOrder.order_id,
            },
        });

        response = makeResponse(
            shipment.pricing,
            tripayTransaction.transaction,
            createdInvoice,
            purchasedItems
        );


    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                return NextResponse.json(
                    ...failResponse(`${e.meta.modelName} not found`, 404)
                );
            }
            return NextResponse.json(
                ...failResponse(prismaErrorCode[e.code], 409, e.meta.modelName)
            );
        }

        if (e instanceof FailError) {
            return NextResponse.json(...failResponse(e.message, e.code, e.detail));
        }
        return NextResponse.json(...errorResponse());
    }

    return NextResponse.json(...successResponse({ purchase_details: response }))
}
