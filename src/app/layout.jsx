import "./globals.css";
import local from "next/font/local";
import { Fredoka } from "next/font/google";

export const baloo = local({
  src: "./fonts/Baloo-Regular.ttf",
  variable: "--font-baloo",
});

export const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Meezu Store",
  description: "Meezu Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${baloo.variable} ${fredoka.variable} font-fredoka`}>
        {children}
      </body>
    </html>
  );
}
