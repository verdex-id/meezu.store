import Link from "next/link";
import Button from "@/components/button";
import Input from "@/components/input";

export default function LinksPage() {
    return (
        <>
            {/* Section Buat Produk */}
            <div className="min-h-dvh w-full max-w-screen-xl mx-auto px-8 text-cyan-900">
                <h1 className="text-black font-baloo text-5xl mt-12 mb-12">Ubah Link</h1>
                <div>
                    <div className="mt-8">
                        <Input 
                            type={"text"}
                            id={"youtube"}
                            name={"youtube"}
                            title={"Youtube"}
                            placeholder="Youtube"
                        />
                    </div>

                    <div className="mt-8">
                        <Input 
                            type={"text"}
                            id={"instagram"}
                            name={"instagram"}
                            title={"Instagram"}
                            placeholder="Instagram"
                        />
                    </div>

                    <div className="mt-8">
                        <Input 
                            type={"text"}
                            id={"whatsapp"}
                            name={"whatsapp"}
                            title={"Whatsapp"}
                            placeholder="Whatsapp"
                        />
                    </div>

                    <div className="mt-8">
                        <Input 
                            type={"text"}
                            id={"tiktok"}
                            name={"tiktok"}
                            title={"TikTok"}
                            placeholder="TikTok"
                        />
                    </div>

                    <div className="mt-12">
                        <Button type={5}>Simpan Perubahan</Button>
                    </div>
                </div>
            </div>
        </>
    )
}