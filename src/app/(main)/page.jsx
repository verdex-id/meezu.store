import Button from "@/components/button";
import Box from "@/components/box";

export default function Home() {
  return (
    <>
      <div className="w-full max-w-screen-xl mx-auto px-8 text-cyan-900 space-y-64 pb-96">
        <div id="hero" className="text-center mt-16 space-y-8">
          <h1 className="font-bold text-4xl md:text-[128px] leading-none">
            Consistency is A Key
          </h1>
          <h2>
            Lorem ipsum dolor sit amet consectetur. Tincidunt quam risus neque
            quam laoreet. Ac quis neque ut cras velit. Porta et malesuada neque
            rhoncus porttitor. Sapien dictum vitae lectus diam eget.
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
              className={"max-w-md mx-auto text-xl text-white"}
            >
              <p>
                Lorem ipsum dolor sit amet consectetur. Sit convallis aliquet
                adipiscing accumsan cras amet integer ut porttitor. Nulla
                consequat ut egestas nulla iaculis urna a quis. Mauris vel
                habitant varius consequat ipsum aliquam. Quis dui egestas
                hendrerit netus eu.
              </p>
            </Box>
            <div className="mt-16 md:mt-0">
              <h1 className="font-bold text-4xl md:text-[125px] leading-none">
                LOGO AKUDAV
              </h1>
              <h2>
                Lorem ipsum dolor sit amet consectetur. Sit convallis aliquet
                adipiscing accumsan cras amet integer ut porttitor. Nulla
                consequat ut egestas nulla iaculis urna a quis. Mauris vel
                habitant varius consequat ipsum aliquam. Quis dui egestas
                hendrerit netus eu.
              </h2>
            </div>
          </div>
        </div>
        <div id="add_merch">
          <h1 className="text-center font-bold text-3xl sm:text-4xl lg:text-6xl p-2">Dapatkan Merchandise Dari Lorem Ipsum Der Silit Ast Lorem Ipsum</h1>
          <p className="text-center p-6 text-lg">Lorem ipsum dolor sit amet consectetur. Tincidunt quam risus neque quam laoreet. Ac quis neque ut cras velit. Porta et malesuada neque rhoncus porttitor. Sapien dictum vitae lectus diam eget.</p>
          <div className="flex flex-row justify-center">
            <Button type={2}>Merchandise</Button>
          </div>
        </div>
      </div>
    </>
  );
}
