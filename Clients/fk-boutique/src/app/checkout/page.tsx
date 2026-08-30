import type { Metadata } from "next";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your cash on delivery order with Farhana & Kulsoom.",
};

export default function CheckoutPage() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />

      <main className="min-h-[65vh] bg-[#f7f4ee]">
        <CheckoutContent />
      </main>

      <SiteFooter />
    </>
  );
}
