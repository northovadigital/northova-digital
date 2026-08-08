import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Problems } from "@/components/sections/Problems";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { WhyNorthova } from "@/components/sections/WhyNorthova";
import { Work } from "@/components/sections/Work";
import { RevealManager } from "@/components/motion/RevealManager";

export default function HomePage() {
  return (
    <>
      <RevealManager />
      <SiteHeader />

      <main>
        <Hero />
        <Problems />
        <Services />
        <Work />
        <Process />
        <WhyNorthova />
        <Faq />
        <FinalCta />
      </main>

      <SiteFooter />
    </>
  );
}
