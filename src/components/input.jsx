export default function Input({
  id,
  name,
  title,
  type,
  wrapperClassName,
  className,
  icon,
  ...props
}) {
  return (
    <>
      <div className={`group relative ${wrapperClassName}`}>
        <label
          htmlFor={id}
          className="font-bold text-2xl text-cyan-900 group-focus-within:text-yellow-200"
        >
          {title}
        </label>
        {type == "textarea" ? (
          <>
            <textarea
              type={type}
              id={id}
              name={name}
              rows={5}
              className={`p-5 mt-1 outline-none bg-white w-full text-black/70 ${className}`}
              {...props}
            />
          </>
        ) : (
          <>
            <input
              type={type}
              id={id}
              name={name}
              className={`p-5 mt-1 outline-none bg-white w-full text-black/70 ${className}`}
              {...props}
            />
          </>
        )}
        <div className="absolute top-0 right-5 h-full">
          <div className="flex items-center h-full">{icon}</div>
        </div>
      </div>
    </>
  );
}
