export default function Box({ primaryBg, secondaryBg, children, className }) {
  return (
    <>
      <div
        className={`relative p-16 flex items-center justify-center ${className}`}
      >
        <div className="z-10">{children}</div>
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className={`${primaryBg} w-full h-full`}></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full px-4 -z-20">
          <div className={`${secondaryBg} w-full h-full -translate-y-4`}></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-full px-4 -z-20">
          <div className={`${secondaryBg} w-full h-full translate-y-4`}></div>
        </div>
      </div>
    </>
  );
}
