import NavbarAdmin from "@/components/navbarAdmin";
import Footer from "@/components/footer";
import { CookiesProvider } from "next-client-cookies/server";
import CheckAuth from "./check_auth";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-cyan-200 text-cyan-900">
      <body>
        <CookiesProvider>
          <NavbarAdmin />
          <CheckAuth>{children}</CheckAuth>
          <Footer />
        </CookiesProvider>
      </body>
    </html>
  );
}
