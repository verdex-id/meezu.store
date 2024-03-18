import Review from "@/components/review";

export default function MerchDetail() {
  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto px-8 mt-5 pb-96">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="grid grid-cols-2 gap-2 max-w-lg">
            <div className="w-full col-span-2 aspect-video bg-pink-300"></div>
            <div className="w-full aspect-square bg-pink-300"></div>
            <div className="w-full aspect-square bg-pink-300"></div>
          </div>
          <div className="space-y-8">
            <h1 className="font-bold font-baloo text-3xl md:text-6xl">
              Product Name
            </h1>
            <p className="font-fredoka">
              Lorem ipsum dolor sit amet consectetur. Fames ornare nibh iaculis
              placerat diam. Ullamcorper at accumsan dictum sed arcu adipiscing
              adipiscing. Sem mollis id integer rhoncus vitae adipiscing iaculis
              quis tellus. Enim egestas sed posuere elit arcu ornare.
            </p>
            <p className="font-fredoka font-semibold text-xl md:text-3xl">
              Rp100.000
            </p>
            <div className="space-y-4">
              <button className="p-3 w-full bg-pink-300 text-white">
                Add to cart
              </button>
              <button className="p-3 w-full bg-cyan-400 text-white">
                Checkout
              </button>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <h1 className="font-baloo font-semibold text-3xl">Ulasan</h1>
          <p>Total 5 ulasan</p>
          <hr className="border-2 border-cyan-900 my-3" />
          <div>
            <Review
              date={"14 Maret 2024"}
              nama={"Agil Ghani Istikmal"}
              rating={5}
              ulasan={"Mantap bosque"}
              profilePicture={
                "https://upload.wikimedia.org/wikipedia/commons/c/c4/Mark_Zuckerberg_F8_2018_Keynote_%28cropped%29.jpg"
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
