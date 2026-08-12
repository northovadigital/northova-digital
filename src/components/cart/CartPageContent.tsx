"use client";

import Link from "next/link";

import { ProductVisual } from "@/components/storefront/ProductVisual";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/currency";

function getVariantText({
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

export function CartPageContent() {
  const {
    items,
    subtotal,
    updateQuantity,
    removeItem,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center sm:px-8 lg:px-10">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-[#9a7c50] uppercase">
          Your cart
        </p>

        <h1 className="mt-4 font-serif text-4xl tracking-[-0.045em] text-[#181512] sm:text-5xl">
          Your cart is empty.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#746d65]">
          Explore the F&K collection and add something you would
          like to order.
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

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div className="mb-10">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-[#9a7c50] uppercase">
          Your selection
        </p>

        <h1 className="mt-3 font-serif text-4xl tracking-[-0.045em] text-[#181512] sm:text-5xl">
          Shopping cart.
        </h1>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <div className="divide-y divide-[#dcd4c8] border-y border-[#dcd4c8]">
          {items.map((item) => {
            const variantText = getVariantText(item);

            return (
              <article
                key={item.key}
                className="grid grid-cols-[92px_1fr] gap-4 py-6 sm:grid-cols-[130px_1fr]"
              >
                <Link
                  href={`/products/${item.slug}`}
                  className="overflow-hidden rounded-md"
                >
                  <ProductVisual
                    category={item.category}
                    variantKey={item.slug}
                    compact
                  />
                </Link>

                <div className="flex min-w-0 flex-col justify-between gap-5">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-serif text-xl tracking-[-0.03em] text-[#211d19]"
                        >
                          {item.name}
                        </Link>

                        {variantText && (
                          <p className="mt-1 text-xs font-medium text-[#837970]">
                            {variantText}
                          </p>
                        )}
                      </div>

                      <p className="shrink-0 text-sm font-semibold text-[#332d27]">
                        {formatPrice(
                          item.unitPrice * item.quantity,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="inline-flex items-center rounded-full border border-[#cbc0b1] bg-[#fffdf9]">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.name} quantity`}
                        onClick={() =>
                          updateQuantity(
                            item.key,
                            item.quantity - 1,
                          )
                        }
                        className="flex h-10 w-10 items-center justify-center text-lg text-[#504941]"
                      >
                        −
                      </button>

                      <span className="min-w-7 text-center text-xs font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        aria-label={`Increase ${item.name} quantity`}
                        disabled={
                          item.quantity >= item.maxStock
                        }
                        onClick={() =>
                          updateQuantity(
                            item.key,
                            item.quantity + 1,
                          )
                        }
                        className="flex h-10 w-10 items-center justify-center text-lg text-[#504941] disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="min-h-10 text-xs font-semibold text-[#8a5e56] underline decoration-[#c9afa9] underline-offset-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="h-fit rounded-lg border border-[#d8cfc1] bg-[#fffdf9] p-6 lg:sticky lg:top-28">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-[#9a7c50] uppercase">
            Order summary
          </p>

          <div className="mt-5 flex items-center justify-between border-b border-[#e0d8cd] pb-5">
            <span className="text-sm text-[#655e57]">
              Subtotal
            </span>

            <span className="text-base font-semibold text-[#2c2722]">
              {formatPrice(subtotal)}
            </span>
          </div>

          <div className="py-5">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-[#655e57]">
                Delivery
              </span>

              <span className="font-medium text-[#3b352f]">
                Confirmed before delivery
              </span>
            </div>

            <p className="mt-3 text-xs leading-5 text-[#81786f]">
              Final delivery details will be confirmed directly
              after you place the order.
            </p>
          </div>

          <div className="border-t border-[#e0d8cd] pt-5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#2f2924]">
                Total
              </span>

              <span className="text-xl font-semibold text-[#181512]">
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#181512] px-6 text-sm font-semibold text-white transition hover:bg-[#35302b]"
          >
            Continue to checkout
          </Link>

          <Link
            href="/shop"
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center text-sm font-semibold text-[#514941]"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
