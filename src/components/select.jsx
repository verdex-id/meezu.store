import ChevronDownIcon from "@/icons/chevron_down";

export default function Select({ id, name, title, type, children, ...props }) {
  return (
    <>
      <div className="group" {...props}>
        <label htmlFor={id} className="font-bold text-2xl">
          {title}
        </label>
        <div className="relative">
          <select
            name={name}
            id={id}
            className="p-5 mt-1 bg-white min-w-[200px] text-black/70 border-l-4 border-white focus:border-cyan-400"
          >
            {children}
          </select>
          <ChevronDownIcon className="absolute top-6 right-3 w-6" />
        </div>
      </div>
    </>
  );
}
