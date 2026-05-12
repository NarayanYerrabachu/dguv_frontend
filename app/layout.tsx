import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

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
        <LanguageProvider>
          <Header />

          <main className="flex-1 flex items-center justify-center">
            {children}
          </main>

          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}