import prisma from "@/lib/prisma";
import { raw } from "@prisma/client/runtime/library";

export async function GET() {
    const voucher = await prisma.discount.findMany({
        where: {
            number_of_uses: {
                lte: raw("usage_limits") 
            },
            
        }
    }) 
}
