import Button from "@/components/button";
import Card from "@/components/card";
import Input from "@/components/input";
import Review from "@/components/review";
import Select from "@/components/select";
import CartIcon from "@/icons/cart";
import StarIcon from "@/icons/star";

export default function Test() {
  const reviews = [
    {
      profilePicture : 'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250',
      nama : 'tito zaki saputro',
      rating : 4,
      ulasan : 'Lorem ipsum dolor sit amet consectetur. Aliquam elit in mattis parturient tellus elit lacus. Sem egestas dictum quam suscipit a dolor. Faucibus in quam pellentesque ornare est viverra nulla tristique tincidunt. Dictum mauris nullam diam sit lorem turpis etiam eget tincidunt.',
      date : '7 - mar - 2024',
    },
    {
      profilePicture : 'https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk',
      nama : 'agil ghani istikmal',
      rating : 5,
      ulasan : 'Lorem ipsum dolor sit amet consectetur. Aliquam elit in mattis parturient tellus elit lacus. Sem egestas dictum quam suscipit a dolor. Faucibus in quam pellentesque ornare est viverra nulla tristique tincidunt. Dictum mauris nullam diam sit lorem turpis etiam eget tincidunt.',
      date : '8 - mar - 2024',
    },
    {
      profilePicture : 'https://loremflickr.com/250/250/dog',
      nama : 'Sultan tzy',
      rating : 4,
      ulasan : 'Lorem ipsum dolor sit amet consectetur. Aliquam elit in mattis parturient tellus elit lacus. Sem egestas dictum quam suscipit a dolor. Faucibus in quam pellentesque ornare est viverra nulla tristique tincidunt. Dictum mauris nullam diam sit lorem turpis etiam eget tincidunt.',
      date : '9 - mar - 2024',
    },
  ]
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
        {/* Star Icons */}
        <div className=" mx-auto mt-5 inline-flex">
          {[...Array(5)].map(() => (
            <StarIcon />
          ))}
        </div>
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
      <div className="mt-5 max-w-screen-xl mx-auto p-8">
         {reviews.map((review,index)=>(
          <Review 
          key={index} // Pastikan untuk menyediakan kunci unik untuk setiap elemen dalam loop pemetaan
          profilePicture={review.profilePicture}
          nama={review.nama}
          rating={review.rating}
          ulasan={review.ulasan}
          date={review.date}
          />
         ))}
        </div>
    
    </div>
    
  );
}
