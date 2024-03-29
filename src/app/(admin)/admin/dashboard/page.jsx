import Button from "@/components/button";
import Input from "@/components/input";
import CardAdmin from "@/components/card_admin";

const dummydata = [
  {
    image: "/logo/akudav2.png",
    title: "Baju Gita JKT48",
    price: 129000,
    discountPrice: 99000,
    sold: 48,
    productId: "ASDAWDHG001",
  },
  {
    image: "/logo/akudav2.png",
    title: "Baju Adel JKT48",
    price: 129000,
    discountPrice: 99000,
    sold: 48,
    productId: "ASDAWDHG002",
  },
  {
    image: "/logo/akudav2.png",
    title: "Baju Fiony JKT48",
    price: 129000,
    discountPrice: 99000,
    sold: 48,
    productId: "ASDAWDHG003",
  },
];

export default function DashboardPage() {
  return (
    <>
      {/* Section Buat Produk */}
      <div className="w-full max-w-screen-xl mx-auto px-8 text-cyan-900">
        <h1 className="text-black font-baloo text-5xl mt-8">Buat Produk</h1>
        <div>
          <div>
            <h1 className="text-cyan-900 font-baloo text-2xl">Thumbnail</h1>
          </div>
          <div>
            <Button type={3}>Pilih File</Button>
          </div>
          <div>
            <Input
              type={"text"}
              id={"namaProduk"}
              name={"namaProduk"}
              title={"Nama Produk"}
              placeholder="Nama Produk"
            />
          </div>
          <div>
            <Input
              type={"textarea"}
              id={"deskripsiProduk"}
              name={"deskripsiProduk"}
              title={"Deskripsi Produk"}
              placeholder="Deskripsi Produk"
            />
          </div>
          <div>
            <Input
              type={"text"}
              id={"diskon"}
              name={"diskon"}
              title={"Diskon"}
              placeholder="Diskon"
            />
          </div>
          <div className="mt-5">
            <Button type={5}>Tambah Produk/Simpan</Button>
          </div>
        </div>
      </div>

      {/* Section Semua Produk */}
      <div className="mt-8 w-full max-w-screen-xl mx-auto px-8 text-cyan-900 pb-16">
        <h1 className="text-black font-baloo text-5xl">Semua Produk</h1>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {dummydata.map((data, index) => (
              <CardAdmin
                key={index}
                image={data.image}
                title={data.title}
                price={data.price}
                discountPrice={data.discountPrice}
                sold={data.sold}
                productId={data.productId}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
