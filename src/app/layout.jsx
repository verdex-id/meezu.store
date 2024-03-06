import "./globals.css";
import { silkscreen } from "./utils/fonts";

export const metadata = {
  title: "Meezu Store",
  description: "Meezu Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={silkscreen}>{children}</body>
    </html>
  );
}
