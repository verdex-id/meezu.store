import Image from "next/image";
import Link from "next/link";

export default function Carousel({ data, ...props }) {
  return (
    <>
      <div
        className="flex gap-2 md:gap-4 lg:gap-8 overflow-x-scroll hide-scrollbar"
        {...props}
      >
        {data.map((d, i) => (
          <Link
            key={i}
            href={d.banner_url || "/"}
            className={`min-w-[90%] aspect-[4/1] bg-white relative flex-grow overflow-hidden`}
          >
            <Image
              src={d.banner_image_path}
              fill
              quality={100}
              className="object-cover"
            />
          </Link>
        ))}
      </div>
    </>
  );
}
