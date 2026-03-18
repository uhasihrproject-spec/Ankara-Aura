import "./globals.css";
import type { Metadata } from "next";
import SiteChrome from "@/components/site/SiteChrome";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "Ankara Aura",
  description: "Premium black & white fashion, made with intention.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}