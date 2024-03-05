import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="flex items-center justify-center w-full text-center">
          <div className="mt-[200px]">
            <h1 className="font-black text-6xl">MEEZUSTORE</h1>
            <h2 className="font-medium text-xl">Under Development</h2>
            <p>
              this project is maintained by{" "}
              <Link
                href={"https://verdex.id"}
                target="_blank"
                className="px-3 bg-blue-950 text-white font-bold"
              >
                verdex.id
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
