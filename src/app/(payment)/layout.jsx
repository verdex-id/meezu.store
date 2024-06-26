import Footer from "@/components/footer";
import { CookiesProvider } from "next-client-cookies/server";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-cyan-200 text-cyan-900">
      <body>
        <CookiesProvider>
          {children}
          <Footer />
        </CookiesProvider>
      </body>
    </html>
  );
}
