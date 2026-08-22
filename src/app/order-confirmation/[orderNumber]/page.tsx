import type { Metadata } from "next";
import Link from "next/link";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

type OrderConfirmationParams = Promise<{
  orderNumber: string;
}>;

export const metadata: Metadata = {
  title: "Order Confirmed",
  description:
    "Your Farhana & Kulsoom order has been placed successfully.",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: OrderConfirmationParams;
}) {
  const { orderNumber } = await params;

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />

      <main className="min-h-[70vh] bg-[#f7f4ee] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8eee3] text-xl text-[#66715b]">
            ✓
          </div>

          <p className="mt-7 text-[10px] font-semibold tracking-[0.2em] text-[#9a7c50] uppercase">
            Order placed
          </p>

          <h1 className="mt-3 font-serif text-4xl tracking-[-0.045em] text-[#181512] sm:text-5xl">
            Thank you for your order.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#746d65]">
            Your order has been recorded successfully. We&apos;ll contact
            you on WhatsApp or phone to confirm the delivery details.
          </p>

          <div className="mx-auto mt-8 max-w-md rounded-xl border border-[#d8cfc1] bg-[#fffdf9] p-6">
            <p className="text-[9px] font-semibold tracking-[0.18em] text-[#9a7c50] uppercase">
              Order number
            </p>

            <p className="mt-3 font-mono text-xl font-semibold tracking-[0.04em] text-[#2f2924]">
              {orderNumber}
            </p>

            <div className="mt-5 border-t border-[#e2dbd0] pt-5 text-sm text-[#635b54]">
              <div className="flex items-center justify-between gap-4">
                <span>Payment</span>
                <span className="font-semibold text-[#2f2924]">
                  Cash on delivery
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span>Status</span>
                <span className="font-semibold text-[#66715b]">
                  Pending confirmation
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#181512] px-7 text-sm font-semibold text-white transition hover:bg-[#35302b]"
            >
              Continue shopping
            </Link>

            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#cbbfad] px-7 text-sm font-semibold text-[#332d27] transition hover:bg-[#fffdf9]"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
