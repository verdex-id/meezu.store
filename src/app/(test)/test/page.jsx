import Button from "@/components/button";
import Card from "@/components/card";
import Input from "@/components/input";
import Select from "@/components/select";

export default function Test() {
  return (
    <div className="pt-24 pb-96">
      {/* Button */}
      <div className="max-w-xl mx-auto">
        <h1 className="font-bold text-xl text-white border-b-4">Button</h1>
        <div className="flex items-center gap-8 mt-2">
          <Button type={1}>Type 1</Button>
          <Button type={2}>Type 2</Button>
        </div>
      </div>

      {/* Input */}
      <div className="mx-auto max-w-xl mt-5">
        <h1 className="font-bold text-xl text-white border-b-4">Input</h1>
        <Input
          type={"text"}
          id={"email"}
          name={"email"}
          title={"Email"}
          placeholder="Email"
        />
        <Input
          type={"number"}
          id={"quantity"}
          name={"quantity"}
          title={"Quantity"}
          placeholder="1"
        />
        <Input
          type={"textarea"}
          id={"detail"}
          name={"detail"}
          title={"Detail"}
          placeholder="Detail Pesanan jika diperlukan"
        />
      </div>

      {/* Select */}
      <div className="mx-auto max-w-xl mt-5">
        <h1 className="font-bold text-xl text-white border-b-4">Select</h1>
        <Select title={"Provinsi"}>
          <option value="kalbar">Kalimantan Barat</option>
          <option value="kalteng">Kalimantan Tengah</option>
          <option value="kaltim">Kalimantan Timur</option>
        </Select>
      </div>

      {/* Card */}
      <div className="mx-auto max-w-screen-md mt-5">
        <h1 className="font-bold text-xl text-white border-b-4">Card</h1>
        <div className="flex gap-2 mt-5">
          <Card
            image={"/images/Thumbnail.svg"}
            title={"Erigo X JKT48"}
            price={129000}
            discountPrice={99000}
            sold={48}
            productId={"ASDAWDHG001"}
          />
          <Card
            image={"/images/Thumbnail.svg"}
            title={"JKT48 New Era T-Shirt"}
            price={179000}
            sold={56}
            productId={"HSDADW002"}
          />
        </div>
      </div>
    </div>
  );
}
