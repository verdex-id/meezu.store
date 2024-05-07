import { FailError } from "@/utils/custom-error";

export async function makeDiscount(tx, discountCode, grossPrice) {
    let discountAmount
    try {
        const discountUsed = await tx.discount.update({
            where: {
                discount_code: discountCode,
                product_discount: { is: null },
            },
            data: {
                number_of_uses: {
                    increment: 1,
                },
            },
            select: {
                discount_value: true,
                is_percent_discount: true,
                maximum_discount_amount: true,
                is_limited: true,
                usage_limits: true,
                number_of_uses: true,
                threshold_discount: true,
                limited_time_discount: true,
                daily_discount: true,
            },
        });

        discountAmount = discountUsed.discount_value;

        if (discountUsed.is_percent_discount) {
            discountAmount = grossPrice * (discountUsed.discount_value / 100);
            if (discountAmount > discountUsed.maximum_discount_amount) {
                discountAmount = discountUsed.maximum_discount_amount;
            }
        }

        if (
            discountUsed.is_limited &&
            discountUsed.number_of_uses > discountUsed.usage_limits
        ) {
            throw new FailError(
                "The discount you've applied has been fully redeemed",
                403,
            )
        }

        if (
            discountUsed.threshold_discount &&
            grossPrice < discountUsed.threshold_discount.minimum_amount
        ) {
            throw new FailError(
                "The total purchase amount does not meet the minimum requirement to apply this discount",
                400,
            )
        }

        if (discountUsed.limited_time_discount || discountUsed.daily_discount) {
            const currentTime = new Date();
            if (discountUsed.limited_time_discount) {
                const effectiveFrom = new Date(
                    discountUsed.limited_time_discount.from_date,
                );
                const expiredDate = new Date(discountUsed.limited_time_discount.to_date);
                if (currentTime < effectiveFrom) {
                    throw new FailError("The discount not yet valid", 403)
                }
                if (currentTime > expiredDate) {
                    throw new FailError("The discount code has expired", 400)
                }
            }

            if (discountUsed.daily_discount) {
                if (
                    currentTime.getHours() < discountUsed.daily_discount.from_hour ||
                    currentTime.getHours() > discountUsed.daily_discount.to_hour
                ) {
                    throw new FailError(
                        "The discount code is not applicable at the current time",
                        403,
                    )
                }
            }
        }


    } catch (e) {
        return {
            amount: null,
            error: e,
        };
    }

    return {
        amount: discountAmount,
        error: null,
    };
}
