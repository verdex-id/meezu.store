import Image from "next/image";
import StarIcon from "@/icons/star";

export default function Review({ profilePicture, nama, rating, ulasan, date }) {
  return (
    <>
      <div className="p-8">
        <div className="flex gap-4">
          <div className="place-items-stretch">
            <Image
              src={profilePicture}
              width={64}
              height={64}
              alt="profile picture"
              className="rounded-full"
            />
          </div>
          <div className="flex-grow">
            <h1 className="font-semibold text-xl text-cyan-900">{nama}</h1>
            <div className="flex">
              {[...Array(rating)].map((_, i) => (
                <div key={i}>
                  <StarIcon className="w-6" />
                </div>
              ))}
            </div>
            <p>{ulasan}</p>
            <p className="text-sm text-cyan-900/70">{date}</p>
          </div>
        </div>
      </div>
    </>
  );
}
