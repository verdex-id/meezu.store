import Image from "next/image";
import Button from "./button";

export default function CardAdmin({
  children,
  image,
  title,
  price,
  discountPrice,
  sold,
  product,
  ...props
}) {
  return (
    <>
      <div className="bg-white w-full max-w-sm mx-auto p-5" {...props}>
        <div className="grid grid-cols-4 gap-2 justify-between">
          <Image
            src={image}
            width={1080}
            height={1080}
            className="object-contain"
          />
          <div className="col-span-2">
            <h1 className="font-bold">{title}</h1>
            <p className="text-sm">
              Normal Price: Rp{Intl.NumberFormat("id-ID").format(price)}
            </p>
            <p className="text-sm">
              Discount Price: Rp
              {Intl.NumberFormat("id-ID").format(discountPrice)}
            </p>
          </div>
          <div>
            <p className="text-xs">Terjual {sold}x</p>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button className="px-3 w-full bg-cyan-400 text-white">Edit</button>
          <button className="px-3 w-full bg-pink-300 text-white">Delete</button>
        </div>
      </div>
    </>
  );
}
