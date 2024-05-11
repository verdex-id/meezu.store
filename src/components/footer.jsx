import Link from "next/link";
import Image from "next/image";
export default function Footer() {
  return (
    <>
      <footer className="text-white gap-8 justify-between p-16 pt-48 pb-48 bg-pink-300">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-screen-xl mx-auto">
          <div className="max-w-sm">
            <Image
              src={"/logo/akudav_21.png"}
              width={1440}
              height={540}
              alt="Logo"
            />
            <p className="mt-16">Support by PT. AKUDAV DUASATU WIJAYA</p>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-3">
            <div>
              <h1 className="font-bold text-3xl mb-16">Links</h1>
              <div className="flex flex-col gap-2">
                <Link href={"/"} className="pb-6">
                  Home
                </Link>
                <Link href={"/merch"} className="pb-6">
                  Merch
                </Link>
              </div>
            </div>

            <div>
              <h1 className="font-bold text-3xl mb-16">Social</h1>
              <div className="flex flex-col gap-2">
                <Link
                  href={"https://www.youtube.com/@AKUDAV"}
                  className="pb-6"
                  target="_blank"
                >
                  Youtube
                </Link>
                <Link
                  href={"https://www.tiktok.com/@akudav_?lang=id-ID"}
                  target="_blank"
                  className="pb-6"
                >
                  Tiktok
                </Link>
                <Link
                  href={"https://www.instagram.com/akudav__/"}
                  className="pb-6"
                  target="_blank"
                >
                  Instagram
                </Link>
                <Link href={"/"} className="pb-6">
                  Twitter
                </Link>
              </div>
            </div>

            <div>
              <h1 className="font-bold text-3xl mb-16">Business</h1>
              <div className="flex flex-col gap-2">
                <Link href={"/"} className="pb-6">
                  Email
                </Link>
                <Link href={"/"} className="pb-6">
                  Phone(+62)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
