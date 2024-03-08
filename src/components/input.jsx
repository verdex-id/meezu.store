export default function Input({ id, name, title, type, ...props }) {
  return (
    <>
      <div className="group">
        <label
          htmlFor={id}
          className="font-bold text-2xl text-white group-focus-within:text-yellow-200"
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
              className="p-5 mt-1 outline-none bg-white w-full text-black/70"
              {...props}
            />
          </>
        ) : (
          <>
            <input
              type={type}
              id={id}
              name={name}
              className="p-5 mt-1 outline-none bg-white w-full text-black/70"
              {...props}
            />
          </>
        )}
      </div>
    </>
  );
}
