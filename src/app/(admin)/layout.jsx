import NavbarAdmin from "@/components/navbarAdmin";
import Footer from "@/components/footer";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-cyan-200 text-cyan-900">
      <body>
        <NavbarAdmin/>
        {children}
        <Footer />
      </body>
    </html>
  );
}
