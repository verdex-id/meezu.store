import Image from "next/image"
import StarIcon from "@/icons/star";

export default function Review( {profilePicture, nama , rating , ulasan , date}){
    return (
        <>
        <div className="p-8">
            <div className="grid grid-cols-[6%,94%] gap-4">
                <div className="  place-items-stretch">
                    <Image 
                    src={profilePicture}
                    width={84}
                    height={84}
                    alt="profile picture"
                    className="rounded-full"
                    />
                </div>
                <div className="flex-grow ">
                    <h1 className="font-bold text-3xl text-cyan-900">{nama}</h1>
                    <div className=" mx-auto mt-4 inline-flex gap-4">
                    {[...Array((rating))].map(() => (
                        <StarIcon />
                    ))}
                    </div>
                    <p className="mt-4">{ulasan}</p>
                    <p className="mt-4">{date}</p>
                </div>      
            </div>
        </div>
        </>
    )
}