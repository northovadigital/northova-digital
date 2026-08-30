import type { Metadata } from "next";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CartPageContent } from "@/components/cart/CartPageContent";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your Farhana & Kulsoom shopping cart.",
};

export default function CartPage() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />

      <main className="min-h-[60vh] bg-[#f7f4ee]">
        <CartPageContent />
      </main>

      <SiteFooter />
    </>
  );
}
