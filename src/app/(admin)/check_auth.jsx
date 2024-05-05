"use client";

import { useCookies } from "next-client-cookies";
import { useEffect } from "react";

export default function CheckAuth({ children }) {
  const cookie = useCookies();
  const accessToken = cookie.get("access_token");
  const refreshToken = cookie.get("refresh_token");

  if (!refreshToken) {
    if (!window.location.pathname.includes("login")) {
      window.location.replace("/admin/login");
    }
  }

  useEffect(() => {
    async function getAccessToken() {
      const res = await fetch("/api/admins/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      }).then((r) => r.json());

      if (res.status == "success") {
        cookie.set("access_token", res.data.access_token);
      } else {
        console.log(res);
      }
    }
    getAccessToken();
  }, []);

  return children;
}
