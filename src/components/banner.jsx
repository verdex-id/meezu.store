import Button from "./button"

export default function Banner({bannerImage}) {
    return (
        <>
            <div className="mx-auto mt-5">
                <div className="bg-cyan-300 mx-auto max-w-[1240px] h-[512px]" {...bannerImage}>
                </div>
                <div className="mx-auto max-w-[1240px]">
                    <h1 className="text-cyan-900 font-baloo text-2xl mt-2 mb-2">Ubah / Hapus Banner</h1>
                    <div className="flex items-center gap-8 mt-2">
                        <Button type={3}>Pilih File</Button>
                        <Button type={4}>Delete</Button>
                    </div>
                </div>
            </div>
        </>
    )
}