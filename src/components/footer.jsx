import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="flex w-full max-w-screen-xl mx-auto text-white gap-8 justify-between">
        <div className="max-w-sm">
          <h1 className="font-bold text-3xl mb-16">LOGO</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur. Diam faucibus sit risus
            neque. In risus pretium vitae felis elementum aliquam. Gravida arcu
            enim lobortis ut tortor massa tellus. Porttitor faucibus aliquam
            maecenas varius quis.
          </p>
        </div>
        <div>
          <h1 className="font-bold text-3xl mb-16">Navigation</h1>
          <div className="flex flex-col gap-2">
            <Link href={"/"}>Home</Link>
            <Link href={"/merch"}>Merch</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
