import ListPesanan from "@/components/listPesanan";

const dummydata = [
  {
    nama: "Sultan",
    no_hp: "08123456789",
    tanggal_pesan: "18-02-2024",
    alamat: "Jl. Durian II",
    nama_produk: "Baju Gita JKT48",
    gambar_produk: "",
  },
  {
    nama: "Akmal",
    no_hp: "08123456789",
    tanggal_pesan: "18-02-2024",
    alamat: "Jl. Durian II",
    nama_produk: "Baju Adel JKT48",
    gambar_produk: "",
  },
  {
    nama: "Ghiffari",
    no_hp: "08123456789",
    tanggal_pesan: "18-02-2024",
    alamat: "Jl. Durian II",
    nama_produk: "Baju Fiony JKT48",
    gambar_produk: "",
  },
];
export default function ListPesananPage() {
  return (
    <>
      <div className="min-h-dvh w-full max-w-screen-xl mx-auto px-8 text-cyan-900 pb-16">
        <h1 className="text-black font-baloo text-5xl mt-8 mb-8">
          List Pesanan
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dummydata.map((data, index) => (
            <ListPesanan
              key={index}
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
  );
}
