"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/currency";
import type { CheckoutDetails } from "@/types/checkout";

function getVariantLabel({
  size,
  volumeMl,
}: {
  size?: string;
  volumeMl?: number;
}): string | null {
  if (volumeMl) {
    return `${volumeMl} ml`;
  }

  if (size) {
    return `Size ${size}`;
  }

  return null;
}

export function CheckoutContent() {
  const { items, subtotal } = useCart();

  const [reviewDetails, setReviewDetails] =
    useState<CheckoutDetails | null>(null);

  function handleReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const details: CheckoutDetails = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      city: "Karachi",
      area: String(formData.get("area") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      landmark:
        String(formData.get("landmark") ?? "").trim() ||
        undefined,
      notes:
        String(formData.get("notes") ?? "").trim() ||
        undefined,
    };

    setReviewDetails(details);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center sm:px-8 lg:px-10">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-[#9a7c50] uppercase">
          Checkout
        </p>

        <h1 className="mt-4 font-serif text-4xl tracking-[-0.045em] text-[#181512] sm:text-5xl">
          Your cart is empty.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#746d65]">
          Add products to your cart before continuing to checkout.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#181512] px-7 text-sm font-semibold text-white"
        >
          Browse collection
        </Link>
      </div>
    );
  }

  if (reviewDetails) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-[#9a7c50] uppercase">
          Final review
        </p>

        <h1 className="mt-3 font-serif text-4xl tracking-[-0.045em] text-[#181512] sm:text-5xl">
          Review your order.
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-lg border border-[#d8cfc1] bg-[#fffdf9] p-6">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.18em] text-[#9a7c50] uppercase">
                    Delivery details
                  </p>

                  <h2 className="mt-3 text-lg font-semibold text-[#2f2924]">
                    {reviewDetails.fullName}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#696159]">
                    {reviewDetails.phone}
                    <br />
                    {reviewDetails.address}
                    <br />
                    {reviewDetails.area}, Karachi
                    {reviewDetails.landmark && (
                      <>
                        <br />
                        Landmark: {reviewDetails.landmark}
                      </>
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setReviewDetails(null)}
                  className="min-h-10 text-xs font-semibold text-[#725f49] underline underline-offset-4"
                >
                  Edit
                </button>
              </div>

              {reviewDetails.notes && (
                <div className="mt-5 border-t border-[#e2dbd0] pt-5">
                  <p className="text-xs font-semibold text-[#514a43]">
                    Order note
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#746d65]">
                    {reviewDetails.notes}
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-lg border border-[#d8cfc1] bg-[#fffdf9] p-6">
              <p className="text-[9px] font-semibold tracking-[0.18em] text-[#9a7c50] uppercase">
                Items
              </p>

              <div className="mt-4 divide-y divide-[#e2dbd0]">
                {items.map((item) => {
                  const variant = getVariantLabel(item);

                  return (
                    <div
                      key={item.key}
                      className="flex items-start justify-between gap-5 py-4 first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#2f2924]">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-[#81786f]">
                          {variant && `${variant} · `}
                          Qty {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-semibold text-[#332d27]">
                        {formatPrice(
                          item.unitPrice * item.quantity,
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-lg border border-[#d8cfc1] bg-[#fffdf9] p-6">
            <p className="text-[9px] font-semibold tracking-[0.18em] text-[#9a7c50] uppercase">
              Order summary
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-[#655e57]">
                Product total
              </span>

              <span className="font-semibold text-[#2f2924]">
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="mt-5 flex items-start justify-between gap-4 border-y border-[#e2dbd0] py-5">
              <span className="text-sm text-[#655e57]">
                Delivery
              </span>

              <span className="text-right text-sm font-medium text-[#3b352f]">
                Confirmed directly
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="font-semibold text-[#2f2924]">
                Payment
              </span>

              <span className="text-sm font-semibold text-[#2f2924]">
                Cash on delivery
              </span>
            </div>

            <div className="mt-6 rounded-lg bg-[#eee8de] p-4">
              <p className="text-xs font-semibold text-[#453e37]">
                Order confirmation
              </p>

              <p className="mt-1 text-xs leading-5 text-[#756d65]">
                We will contact you on WhatsApp or phone to confirm
                your order and delivery details.
              </p>
            </div>

            <button
              type="button"
              disabled
              className="mt-6 inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-[#8b847b] px-6 text-sm font-semibold text-white"
            >
              Place COD order
            </button>

            <p className="mt-3 text-center text-[10px] leading-4 text-[#81786f]">
              Order submission will be enabled after the secure
              order database is connected.
            </p>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <p className="text-[10px] font-semibold tracking-[0.2em] text-[#9a7c50] uppercase">
        Cash on delivery
      </p>

      <h1 className="mt-3 font-serif text-4xl tracking-[-0.045em] text-[#181512] sm:text-5xl">
        Delivery details.
      </h1>

      <p className="mt-4 max-w-xl text-sm leading-6 text-[#746d65]">
        Enter the details we should use to confirm and deliver your
        order in Karachi.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={handleReview}
          className="rounded-lg border border-[#d8cfc1] bg-[#fffdf9] p-5 sm:p-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-[#514a43]">
                Full name *
              </span>

              <input
                required
                name="fullName"
                autoComplete="name"
                className="mt-2 min-h-12 w-full rounded-lg border border-[#d4cabd] bg-white px-4 text-sm outline-none transition focus:border-[#9a7c50]"
                placeholder="Your full name"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-[#514a43]">
                Phone / WhatsApp *
              </span>

              <input
                required
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                pattern="[\d+\-\s()]{10,18}"
                className="mt-2 min-h-12 w-full rounded-lg border border-[#d4cabd] bg-white px-4 text-sm outline-none transition focus:border-[#9a7c50]"
                placeholder="03XX XXXXXXX"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-[#514a43]">
                City
              </span>

              <input
                readOnly
                value="Karachi"
                className="mt-2 min-h-12 w-full rounded-lg border border-[#d4cabd] bg-[#f1ede6] px-4 text-sm text-[#756d65]"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-[#514a43]">
                Area *
              </span>

              <input
                required
                name="area"
                autoComplete="address-level2"
                className="mt-2 min-h-12 w-full rounded-lg border border-[#d4cabd] bg-white px-4 text-sm outline-none transition focus:border-[#9a7c50]"
                placeholder="e.g. Gulshan-e-Iqbal"
              />
            </label>
          </div>

          <label className="mt-5 block">
            <span className="text-xs font-semibold text-[#514a43]">
              Complete address *
            </span>

            <textarea
              required
              name="address"
              autoComplete="street-address"
              rows={4}
              className="mt-2 w-full resize-y rounded-lg border border-[#d4cabd] bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#9a7c50]"
              placeholder="House / flat, street, block and complete address"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-xs font-semibold text-[#514a43]">
              Nearby landmark
            </span>

            <input
              name="landmark"
              className="mt-2 min-h-12 w-full rounded-lg border border-[#d4cabd] bg-white px-4 text-sm outline-none transition focus:border-[#9a7c50]"
              placeholder="Optional"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-xs font-semibold text-[#514a43]">
              Order note
            </span>

            <textarea
              name="notes"
              rows={3}
              className="mt-2 w-full resize-y rounded-lg border border-[#d4cabd] bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#9a7c50]"
              placeholder="Any special instructions? Optional"
            />
          </label>

          <div className="mt-7 rounded-lg border border-[#ddd4c7] bg-[#f3eee6] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#3d3731]">
                  Cash on delivery
                </p>

                <p className="mt-1 text-xs leading-5 text-[#756d65]">
                  Payment will be collected at delivery before
                  product handover.
                </p>
              </div>

              <span className="shrink-0 text-[9px] font-semibold tracking-[0.14em] text-[#778067] uppercase">
                Selected
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#181512] px-7 text-sm font-semibold text-white transition hover:bg-[#35302b]"
          >
            Review order
          </button>
        </form>

        <aside className="h-fit rounded-lg border border-[#d8cfc1] bg-[#fffdf9] p-6 lg:sticky lg:top-28">
          <p className="text-[9px] font-semibold tracking-[0.18em] text-[#9a7c50] uppercase">
            Your order
          </p>

          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div
                key={item.key}
                className="flex justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-medium text-[#3d3731]">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-[#81786f]">
                    {getVariantLabel(item) &&
                      `${getVariantLabel(item)} · `}
                    Qty {item.quantity}
                  </p>
                </div>

                <p className="shrink-0 text-xs font-semibold text-[#332d27]">
                  {formatPrice(
                    item.unitPrice * item.quantity,
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-[#e0d8cd] pt-5">
            <span className="font-semibold text-[#2f2924]">
              Product total
            </span>

            <span className="text-lg font-semibold text-[#181512]">
              {formatPrice(subtotal)}
            </span>
          </div>

          <Link
            href="/cart"
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center text-sm font-semibold text-[#655e57]"
          >
            ← Edit cart
          </Link>
        </aside>
      </div>
    </div>
  );
}
