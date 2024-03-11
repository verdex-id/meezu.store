import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="grid grid-cols-1 md:grid-cols-2 w-full max-w-screen-xl mx-auto text-white gap-8 justify-between p-16 pt-48 pb-48 bg-pink-300">
        <div className="max-w-sm">
          <h1 className="font-bold text-3xl mb-16">LOGO</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur. Diam faucibus sit risus
            neque. In risus pretium vitae felis elementum aliquam. Gravida arcu
            enim lobortis ut tortor massa tellus. Porttitor faucibus aliquam
            maecenas varius quis.
          </p>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-3">
          <div>
            <h1 className="font-bold text-3xl mb-16">Links</h1>
            <div className="flex flex-col gap-2">
              <Link href={"/"} className="pb-6">Home</Link>
              <Link href={"/"} className="pb-6">Merch</Link>
            </div>
          </div>

          <div>
            <h1 className="font-bold text-3xl mb-16">Social</h1>
            <div className="flex flex-col gap-2">
              <Link href={"/"} className="pb-6">Youtube</Link>
              <Link href={"/"} className="pb-6">Tiktok</Link>
              <Link href={"/"} className="pb-6">Instagram</Link>
              <Link href={"/"} className="pb-6">Twitter</Link>
            </div>
          </div>

          <div>
            <h1 className="font-bold text-3xl mb-16">Business</h1>
            <div className="flex flex-col gap-2">
              <Link href={"/"} className="pb-6">Email</Link>
              <Link href={"/"} className="pb-6">Phone(+62)</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
