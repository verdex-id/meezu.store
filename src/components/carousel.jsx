import Image from "next/image";

export default function Carousel({ data, ...props }) {
  return (
    <>
      <div
        className="flex gap-2 md:gap-4 lg:gap-8 overflow-x-scroll hide-scrollbar"
        {...props}
      >
        {data.map((d, i) => (
          <div
            key={i}
            className={`min-w-[90%] aspect-[4/1] bg-white relative flex-grow overflow-hidden`}
          >
            <Image
              src={d.image}
              layout="fill"
              objectFit="cover"
              quality={100}
            />
          </div>
        ))}
      </div>
    </>
  );
}
