import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Ankara Aura",
  description: "Premium black & white fashion, made with intention.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}