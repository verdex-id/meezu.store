import Link from "next/link";
import Button from "@/components/button";
import Banner from "@/components/banner";


const dummydata=[
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
        
    }
]

export default function BannerPage() {
    return (
        <>
            <div className="min-h-dvh w-full max-w-screen-xl mx-auto px-8 text-cyan-900">
                <h1 className="text-black font-baloo text-5xl mt-8 mb-8">Edit dan Post Banner</h1>
                <div>
                    <div className="mt-8 mb-16">
                        {dummydata.map((data,index) => (
                            <Banner key={index}
                            bannerImage={data.bannerImage}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}