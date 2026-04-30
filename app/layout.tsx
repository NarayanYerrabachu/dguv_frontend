import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "DGUV App",
  description: "Next.js App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-white">
        <Header />

        <main className="pt-4 pb-16 px-6 bg-white">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}