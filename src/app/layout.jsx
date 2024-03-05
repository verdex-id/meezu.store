import "./globals.css";

export const metadata = {
  title: "Meezu Store",
  description: "Meezu Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
