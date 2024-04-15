import ChevronDownIcon from "@/icons/chevron_down";
import Image from "next/image";

export default function Select({ id, name, title, type, children, ...props }) {
  return (
    <>
      <div className="group" {...props}>
        <label htmlFor={id} className="font-bold text-2xl">
          {title}
        </label>
        <div className="relative flex p-5 mt-1 bg-white border-l-4 border-white focus:border-cyan-900">
          <select
            name={name}
            id={id}
            className="outline-none w-full text-black/70 bg-transparent"
          >
            {children}
          </select>
          <ChevronDownIcon className="w-6" />
        </div>
      </div>
    </>
  );
}
