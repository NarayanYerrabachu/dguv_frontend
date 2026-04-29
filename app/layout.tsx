import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "DGUV Chat",
  description: "DGUV Chat Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        <Header />
        <main className="pt-[var(--header-height)] pb-[var(--footer-height)] h-screen overflow-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
