import Button from "@/components/button";
import Box from "@/components/box";

export default function Home() {
  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto px-8 text-cyan-900 space-y-64 pb-96">
        <div id="hero" className="text-center mt-16 space-y-8">
          <h1 className="font-bold font-baloo text-4xl md:text-[128px] leading-none">
            Consistency is A Key
          </h1>
          <h2>
            Hallo Davengers! <br />
            Ayo berjelajah dan miliki merchandise resmi AKUDAV di Meezu Store!
          </h2>
          
          <div className="flex items-center gap-4 justify-center">
            <Button
              type={2}
              href={"https://youtube.com/akudav"}
              target={"_blank"}
            >
              YouTube
            </Button>
            <Button type={2} href={"/merch"}>
              Merchandise
            </Button>
          </div>
        </div>
        <div id="about">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Box
              primaryBg={"bg-pink-400"}
              secondaryBg={"bg-pink-300"}
              className={"max-w-md mx-auto text-xl text-white mt-16"}
            >
              <p className="font-semibold ">
              “Konsistensi adalah kunci menuju petualangan tak terbatas.  Bukan sekadar Subscriber, kalian adalah Davengers yang solid!”
              </p>
            </Box>
            <div className="mt-16 md:mt-0">
              <h1 className="font-bold text-4xl md:text-[64px] leading-none">
                About AKUDAV
              </h1>
              <div className="mt-8">
                  <p className="mt-4">AKUDAV bisa panggil aku dav. </p>
                  <p className="mt-4">1 Juli 2020 upload video pertama dan sekarang sudah memiliki 3.000.000++ subscribers. </p>
                  <p className="mt-4">Itu bukan perjalanan yang mudah, tapi dengan dukungan kalian yang membuat perjalanan ini menjadi mengasyikkan.</p>
                  <p className="mt-4">Perjalanan kita tidak berhenti disini, Ayo bergabung para Davengers untuk pergi ke pertualangan seru yang tak terbatas.</p>
              </div>
              <div className="flex justify-start mt-8">
                  <Button
                  type={2}
                  href={'https://youtube.com/akudav'} 
                  target={'_blank'} >
                    Youtube
                  </Button>
                
              </div>
            </div>
          </div>
        </div>
        <div id="add_merch">
          <h1 className="text-center font-baloo font-bold text-3xl sm:text-4xl lg:text-6xl p-2">
          Dapatkan Merchandise dari AKUDAV jadilah Davengers sejati
          </h1>
          <p className="text-center p-6 text-lg">
            Tunjukkan kepada dunia bahwa kamu adalah seorang Davengers sejati dengan memiliki merchandise eksklusif dari AKUDAV. 
            Ayo koleksi sekarang!
          </p>
          <div className="flex flex-row justify-center">
            <Button type={2}>Merchandise</Button>
          </div>
        </div>
        <div id="buy-guide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* left grid */}
            <div>
              <h1 className="font-baloo text-[64px] mt-16">
                Bagaimana Cara Memesan?
              </h1>
              <div className="flex ">
                <Button type={2} >Merchandise</Button>
              </div>
            
            </div>
            <div>
              <Box
              primaryBg={'bg-cyan-300'} 
              secondaryBg={'bg-cyan-600'}
              className='max-w-md mx-auto text-xl  text-white '>
                <ul className="list-disc font-semibold">
                  <li>Pergi ke Merchandise</li>
                  <li>Cari produk yang kamu cari</li>
                  <li>Kamu bisa memasukan ke keranjang atau Check Out langsung</li>
                  <li>Isi form pengiriman , pastikan email dan data lainya sudah benar yah... gaboleh salah</li>
                  <li>Setelah melakukan pembayaran. Cek email untuk melihat invoice</li>
                </ul>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
