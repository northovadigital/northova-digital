import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BrandStory } from "@/components/storefront/BrandStory";
import { CategoryGrid } from "@/components/storefront/CategoryGrid";
import { Hero } from "@/components/storefront/Hero";
import { NewArrivals } from "@/components/storefront/NewArrivals";
import { TrustStrip } from "@/components/storefront/TrustStrip";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />

      <main>
        <Hero />
        <TrustStrip />
        <CategoryGrid />
        <NewArrivals />
        <BrandStory />
      </main>

      <SiteFooter />
    </>
  );
}
