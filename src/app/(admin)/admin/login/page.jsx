import Button from "@/components/button";
import Input from "@/components/input";
import Image from "next/image";

export default function AdminLoginPage() {
    return (
        <>
            <div className="min-h-dvh w-full max-w-screen-xl mx-auto text-cyan-900">
                <div>
                    <h1 className="text-center font-baloo font-bold text-3xl sm:text-4xl lg:text-6xl p-12 mt-12">Admin Dashboard</h1>
                </div>
                <div className="grid grid-cols-2 gap-8 p-4 mt-8">
                    <div>
                        <div className="mt-8">
                            <Input 
                                type={"text"}
                                id={"username"}
                                name={"username"}
                                title={"Username"}
                                placeholder="Username"
                            />
                        </div>
                        <div className="mt-8">
                            <Input 
                                type={"text"}
                                id={"password"}
                                name={"password"}
                                title={"Password"}
                                placeholder="Password"
                            />
                        </div>
                        <div className="mt-12">
                            <Button type={2}>Masuk</Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-end">
                        <Image
                            src={"/logo/akudav2.png"}
                            alt="logo"
                            width={505}
                            height={505}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
