"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/site/Footer";
import MainNavbar from "@/components/site/MainNavbar";
import Navbar from "@/components/site/Navbar";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const useShopChrome = pathname.startsWith("/shop") || pathname.startsWith("/checkout");

  return (
    <>
      {useShopChrome ? <Navbar /> : <MainNavbar />}
      <main>{children}</main>
      <Footer />
    </>
  );
}
