import HomeShell from "@/components/home/HomeShell";
import Hero from "@/components/home/Hero";
import Homepage from "@/components/home/Homepage";

export default function HomePage() {
  return (
    <HomeShell>
      <Hero />
      <Homepage />
    </HomeShell>
  );
}