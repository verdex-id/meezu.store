import ListPesanan from "@/components/listPesanan";
import Link from "next/link";


const dummydata=[
    {
        nama:"Sultan",
        no_hp:"08123456789",
        tanggal_pesan:"18-02-2024",
        alamat:"Jl. Durian II",
        nama_produk:"Baju Gita JKT48",
        gambar_produk:""
        
    },
    {
        nama:"Akmal",
        no_hp:"08123456789",
        tanggal_pesan:"18-02-2024",
        alamat:"Jl. Durian II",
        nama_produk:"Baju Adel JKT48",
        gambar_produk:""
        
    },
    {
        nama:"Ghiffari",
        no_hp:"08123456789",
        tanggal_pesan:"18-02-2024",
        alamat:"Jl. Durian II",
        nama_produk:"Baju Fiony JKT48",
        gambar_produk:""
        
    }
]
export default function ListPesananPage() {
    return (
        <>
            <div className="min-h-dvh w-full max-w-screen-xl mx-auto px-8 text-cyan-900">
                <h1 className="text-black font-baloo text-5xl mt-8 mb-8">List Pesanan</h1>
                <div>
                    {dummydata.map((data,index) => (
                        <ListPesanan key={index}
                        nama={data.nama}
                        no_hp={data.no_hp}
                        tanggal_pesan={data.tanggal_pesan}
                        alamat={data.alamat}
                        nama_produk={data.nama_produk}
                        gambar_produk={data.gambar_produk}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}