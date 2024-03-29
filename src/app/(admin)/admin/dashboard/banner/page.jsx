import Button from "@/components/button";
import Image from "next/image";

const dummydata = [
  {
    bannerImage:
      "https://yt3.googleusercontent.com/VcIVBcyUF5yBA_D7H4eEImf_iIy-V3QZjyvHBPGl1j98UXQuqQJ7_DOKXmmtEe27_mUh4L8nVg=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
  },
  {
    bannerImage:
      "https://yt3.googleusercontent.com/VcIVBcyUF5yBA_D7H4eEImf_iIy-V3QZjyvHBPGl1j98UXQuqQJ7_DOKXmmtEe27_mUh4L8nVg=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
  },
  {
    bannerImage:
      "https://yt3.googleusercontent.com/VcIVBcyUF5yBA_D7H4eEImf_iIy-V3QZjyvHBPGl1j98UXQuqQJ7_DOKXmmtEe27_mUh4L8nVg=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
  },
];

export default function BannerPage() {
  return (
    <>
      <div className="min-h-dvh w-full max-w-screen-xl mx-auto px-8 text-cyan-900">
        <h1 className="text-black font-baloo text-5xl mt-8 mb-8">
          Edit dan Post Banner
        </h1>
        <div>
          <div className="mt-8 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {dummydata.map((data, index) => (
                <div key={index}>
                  <div className="mx-auto mt-5">
                    <Image
                      src={data.bannerImage}
                      className="bg-cyan-300 mx-auto aspect-[4/1] object-cover"
                      width={1080}
                      height={1080}
                    ></Image>
                    <div className="mx-auto max-w-[1240px]">
                      <h1 className="text-cyan-900 font-baloo text-2xl">
                        Ubah / Hapus Banner
                      </h1>
                      <div className="flex items-center gap-2">
                        <Button type={3}>Pilih File</Button>
                        <Button type={4}>Delete</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
