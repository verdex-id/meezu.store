import Link from "next/link";

export default function Button({ type, href, target, children, onClick }) {
  return (
    <>
      {/* Type 1 */}
      {type == 1 ? (
        <>
          {href ? (
            <Link
              href={href}
              target={target}
              className="px-8 py-5 bg-cyan-500 text-white relative h-[48px] flex items-center group"
            >
              <p className="z-50">{children}</p>
              <div className="absolute top-0 left-0 w-full mx-auto h-full px-1 -z-10 group-hover:px-[6px]">
                <div className="bg-cyan-200 w-full h-[56px] mx-auto -translate-y-1"></div>
              </div>
            </Link>
          ) : (
            <button
              onClick={onClick}
              className="px-8 py-5 bg-cyan-500 text-white relative h-[48px] flex items-center group"
            >
              <p className="z-50">{children}</p>
              <div className="absolute top-0 left-0 w-full mx-auto h-full px-1 -z-10 group-hover:px-[6px]">
                <div className="bg-cyan-200 w-full h-[56px] mx-auto -translate-y-1"></div>
              </div>
            </button>
          )}
        </>
      ) : (
        type == 2 && (
          <>
            {href ? (
              <Link
                href={href}
                target={target}
                className="px-8 py-5 text-white relative h-[48px] flex items-center"
              >
                <p className="z-50">{children}</p>
                <div className="absolute top-0 left-0 w-full mx-auto h-full -z-10">
                  <div className="bg-cyan-500 w-full h-full mx-auto group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] transition duration-500"></div>
                </div>
                <div className="absolute top-0 left-0 w-full mx-auto h-full -z-20">
                  <div className="bg-cyan-400 w-full h-full mx-auto translate-y-1 translate-x-1 group-hover:translate-x-[5px] group-hover:translate-y-[5px] transition duration-500"></div>
                </div>
              </Link>
            ) : (
              <button
                onClick={onClick}
                className="px-8 py-5 text-white relative h-[48px] flex items-center group"
              >
                <p className="z-50">{children}</p>
                <div className="absolute top-0 left-0 w-full mx-auto h-full -z-10">
                  <div className="bg-cyan-500 w-full h-full mx-auto group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] transition duration-500"></div>
                </div>
                <div className="absolute top-0 left-0 w-full mx-auto h-full -z-20">
                  <div className="bg-cyan-400 w-full h-full mx-auto translate-y-1 translate-x-1 group-hover:translate-x-[5px] group-hover:translate-y-[5px] transition duration-500"></div>
                </div>
              </button>
            )}
          </>
        )
      )}
    </>
  );
}
