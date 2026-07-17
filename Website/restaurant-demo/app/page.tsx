import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import FeaturedMenu from "@/components/sections/FeaturedMenu";
import Ordering from "@/components/sections/Ordering";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import Reservation from "@/components/sections/Reservation";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
        <FeaturedMenu />
        <Ordering />
        <Gallery />
        <Testimonials />
        <Reservation />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
