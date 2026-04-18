import HeroShowreel from "@/components/HeroShowreel";
import WorksGrid from "@/components/WorksGrid";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <HeroShowreel />
      <WorksGrid />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
