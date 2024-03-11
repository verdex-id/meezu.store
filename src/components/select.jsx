import Image from "next/image";

export default function Select({ id, name, title, type, children, ...props }) {
  return (
    <>
      <div className="group" {...props}>
        <label
          htmlFor={id}
          className="font-bold text-2xl text-cyan-900 group-focus-within:text-yellow-200"
        >
          {title}
        </label>
        <div className="relative">
          <select
            name={name}
            id={id}
            className="p-5 mt-1 outline-none bg-white w-full text-black/70"
          >
            {children}
          </select>
          <Image
            src={"/icons/arrow_drop_down_circle.svg"}
            height={24}
            width={24}
            className="absolute top-0 right-3 h-full opacity-50"
          />
        </div>
      </div>
    </>
  );
}
