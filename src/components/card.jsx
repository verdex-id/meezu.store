import Image from "next/image";

export default function Card({
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
        <div className="flex flex-col justify-between h-full w-full">
          <div>
            <div>
              <Image
                src={image}
                width={1080}
                height={1080}
                className="h-[400px] object-contain"
              />
            </div>
            <div className="space-y-1">
              <h1 className="font-bold">{title}</h1>
              <p
                className={`${
                  discountPrice != undefined &&
                  "line-through text-sm text-pink-600/80"
                } text-xl`}
              >
                Rp{Intl.NumberFormat("id-ID").format(price)}
              </p>
              {discountPrice && (
                <p className="text-xl">
                  Rp{Intl.NumberFormat("id-ID").format(discountPrice)}
                </p>
              )}
              <div>{children}</div>
              <p className="text-pink-600/70">Terjual {sold} kali</p>
            </div>
          </div>
          <div className="space-y-4 mt-5">
            <button className="p-3 w-full bg-pink-300 text-white">
              ADD TO CART
            </button>
            <button className="p-3 w-full bg-cyan-400 text-white">
              CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
