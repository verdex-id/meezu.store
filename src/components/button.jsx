import Link from "next/link";

export default function Button({
  type,
  href,
  target,
  children,
  onClick,
  primaryBg,
  secondaryBg,
  textColor,
}) {
  return (
    <>
      {/* Type 1 */}
      {type == 1 ? (
        <>
          {href ? (
            <Link
              href={href}
              target={target}
              className={`px-8 py-5 bg-white !${primaryBg} text-cyan-900 !${textColor} relative h-[48px] flex items-center group`}
            >
              <p className="z-50">{children}</p>
              <div className="absolute top-0 left-0 w-full mx-auto h-full px-1 -z-10 group-hover:px-[6px]">
                <div
                  className={`bg-cyan-200 !${secondaryBg} w-full h-[56px] mx-auto -translate-y-1`}
                ></div>
              </div>
            </Link>
          ) : (
            <button
              onClick={onClick}
              className={`px-8 py-5 bg-white !${primaryBg} text-cyan-900 !${textColor} relative h-[48px] flex items-center group`}
            >
              <p className="z-50">{children}</p>
              <div
                className={`absolute top-0 left-0 w-full mx-auto h-full px-1 -z-10 group-hover:px-[6px]`}
              >
                <div
                  className={`bg-cyan-200 !${secondaryBg} w-full h-[56px] mx-auto -translate-y-1`}
                ></div>
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
        {type == 3 && (
          <>
            {href ? (
              <Link
                href={href}
                target={target}
                className="px-10 py-6 text-white relative h-[48px] flex items-center"
              >
              </Link>
            ) : (
              <button
                onClick={onClick}
                className="px-10 py-6 text-cyan-900 relative w-[336px] h-[48px] flex items-center justify-center group border-2 border-cyan-500"
              >
                <p className="z-50">{children}</p>
                <div className="absolute top-0 left-0 w-full mx-auto h-full">
                  <div className="bg-cyan-200 w-full h-full mx-auto"></div>
                </div>
              </button>
            )}
          </>
      )}
        {type == 4 && (
          <>
            {href ? (
              <Link
                href={href}
                target={target}
                className="px-10 py-6 text-white relative h-[48px] flex items-center"
              >
              </Link>
            ) : (
              <button
                onClick={onClick}
                className="px-10 py-6 text-white relative w-[336px] h-[48px] flex items-center justify-center group border-2 border-pink-300"
              >
                <p className="z-50">{children}</p>
                <div className="absolute top-0 left-0 w-full mx-auto h-full">
                  <div className="bg-pink-300 w-full h-full mx-auto"></div>
                </div>
              </button>
            )}
          </>
        )}
                {type == 5 && (
          <>
            {href ? (
              <Link
                href={href}
                target={target}
                className="px-10 py-6 text-white relative h-[48px] flex items-center"
              >
              </Link>
            ) : (
              <button
                onClick={onClick}
                className="px-10 py-6 text-white relative w-[336px] h-[48px] flex items-center justify-center group border-2 border-cyan-400"
              >
                <p className="z-50">{children}</p>
                <div className="absolute top-0 left-0 w-full mx-auto h-full">
                  <div className="bg-cyan-400 w-full h-full mx-auto"></div>
                </div>
              </button>
            )}
          </>
        )}
    </>
  );
}