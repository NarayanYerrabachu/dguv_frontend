import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
    <html lang="de" suppressHydrationWarning>
      <body className={`${sourceSans3.className} min-h-screen flex flex-col bg-white`}>
        <Header />
        <main className="pt-6.5  flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
