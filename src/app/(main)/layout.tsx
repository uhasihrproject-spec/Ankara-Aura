import Footer from "@/components/site/Footer";
import MainNavbar from "@/components/site/MainNavbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainNavbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
