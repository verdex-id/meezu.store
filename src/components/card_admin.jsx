import Image from "next/image";
import Link from "next/link";

export default function CardAdmin({ product, ...props }) {
  return (
    <>
      <div className="bg-white w-full max-w-sm mx-auto p-5" {...props}>
        <div className="grid grid-cols-4 gap-2 justify-between">
          <Image
            src={"/banner/banner_1.png"}
            width={1080}
            height={1080}
            className="object-cover aspect-square"
          />
          <div className="col-span-2">
            <h1 className="font-bold">{product.product_name}</h1>
            <p className="text-sm">
              Rp
              {Intl.NumberFormat("id-ID").format(
                product.product_iterations[0].product_variant_price
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Link
            className="px-3 w-full bg-cyan-400 text-white text-center"
            href={"/admin/dashboard/product/edit/" + product.product_slug}
          >
            Edit
          </Link>
        </div>
      </div>
    </>
  );
}
