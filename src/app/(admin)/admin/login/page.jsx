"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import Image from "next/image";
import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errors, setErrors] = useState();
  const [loading, setLaoding] = useState(false);

  async function handleLogin() {
    setLaoding(true);
    const res = await fetch("/api/admins/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then((r) => r.json());

    if (res.status == "fail") {
      setErrors(res.message);
    } else {
      window.location.replace("/admin/dashboard");
    }
    setLaoding(false);
  }
  return (
    <>
      <div className="min-h-dvh w-full max-w-screen-xl mx-auto text-cyan-900">
        <div>
          <h1 className="text-center font-baloo font-bold text-3xl sm:text-4xl lg:text-6xl p-12 mt-12">
            Admin Dashboard
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-8 p-4 mt-8">
          <div>
            {errors && (
              <div className="mt-8 bg-red-300 border-l-4 border-red-500 p-5">
                Error: {errors}
              </div>
            )}
            <div className="mt-8">
              <Input
                type={"text"}
                id={"email"}
                name={"email"}
                title={"Email"}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-8">
              <Input
                type={"password"}
                id={"password"}
                name={"password"}
                title={"Password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={`mt-12 ${loading && "animate-pulse"}`}>
              <Button onClick={handleLogin} type={2}>
                {loading ? "Loading..." : "Masuk"}
              </Button>
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
  );
}
