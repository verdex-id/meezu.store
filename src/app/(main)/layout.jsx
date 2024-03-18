import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-cyan-200 text-cyan-900">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
