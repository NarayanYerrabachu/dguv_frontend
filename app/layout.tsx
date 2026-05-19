import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "dguv-chat",
  description: "Chatbot der DGUV zu Sicherheit und Gesundheit in Bildungseinrichtungen",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
  },
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

        <main className="flex-1 flex items-center justify-center">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}