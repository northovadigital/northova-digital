"use client";

import { useState } from "react";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/currency";
import type { ProductVariant } from "@/types/product";

type ProductVariantSelectorProps = {
  productId: string;
  slug: string;
  name: string;
  category: string;
  basePrice: number;
  variants: ProductVariant[];
};

function getVariantLabel(
  variant: ProductVariant,
): string | null {
  if (variant.volumeMl) {
    return `${variant.volumeMl} ml`;
  }

  if (variant.size) {
    return variant.size;
  }

  return null;
}

export function ProductVariantSelector({
  productId,
  slug,
  name,
  category,
  basePrice,
  variants,
}: ProductVariantSelectorProps) {
  const { addItem, items } = useCart();

  const initialVariant =
    variants.find((variant) => variant.stock > 0) ??
    variants[0];

  const [selectedVariantId, setSelectedVariantId] =
    useState(initialVariant?.id ?? "");

  const [added, setAdded] = useState(false);

  const selectedVariant =
    variants.find(
      (variant) => variant.id === selectedVariantId,
    ) ?? initialVariant;

  const visibleVariants = variants.filter(
    (variant) => getVariantLabel(variant) !== null,
  );

  const selectedPrice =
    selectedVariant?.price ?? basePrice;

  const selectedStock =
    selectedVariant?.stock ?? 0;

  const selectedCartKey = selectedVariant
    ? `${productId}:${selectedVariant.id}`
    : "";

  const quantityInCart =
    items.find((item) => item.key === selectedCartKey)
      ?.quantity ?? 0;

  const stockLimitReached =
    selectedStock > 0 &&
    quantityInCart >= selectedStock;

  const selectorLabel =
    category === "fragrances"
      ? "Bottle size"
      : "Select size";

  function handleAddToCart() {
    if (
      !selectedVariant ||
      selectedVariant.stock <= 0 ||
      stockLimitReached
    ) {
      return;
    }

    addItem({
      productId,
      slug,
      name,
      category,
      variantId: selectedVariant.id,
      size: selectedVariant.size,
      volumeMl: selectedVariant.volumeMl,
      unitPrice: selectedPrice,
      maxStock: selectedVariant.stock,
    });

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1200);
  }

  let buttonLabel = "Add to cart";

  if (selectedStock <= 0) {
    buttonLabel = "Sold out";
  } else if (stockLimitReached) {
    buttonLabel = `Maximum in cart (${selectedStock})`;
  } else if (added) {
    buttonLabel = "Added to cart ✓";
  }

  return (
    <div>
      <p className="text-xl font-semibold text-[#2f2924]">
        {formatPrice(selectedPrice)}
      </p>

      {visibleVariants.length > 0 && (
        <div className="mt-7">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold text-[#514a43]">
              {selectorLabel}
            </p>

            {category === "fragrances" && (
              <p className="text-[10px] font-medium text-[#81776d]">
                Select your preferred volume
              </p>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {visibleVariants.map((variant) => {
              const active =
                variant.id === selectedVariant?.id;

              const unavailable = variant.stock <= 0;

              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={unavailable}
                  onClick={() => {
                    setSelectedVariantId(variant.id);
                    setAdded(false);
                  }}
                  className={`inline-flex min-h-11 min-w-14 items-center justify-center rounded-full border px-4 text-xs font-semibold transition ${
                    active
                      ? "border-[#181512] bg-[#181512] text-white"
                      : "border-[#cbbfad] bg-[#fffdf9] text-[#403932] hover:border-[#9a7c50]"
                  } ${
                    unavailable
                      ? "cursor-not-allowed opacity-40"
                      : ""
                  }`}
                >
                  {getVariantLabel(variant)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-5 border-y border-[#dcd3c6] py-5">
        <span className="text-xs font-semibold text-[#514a43]">
          Availability
        </span>

        <span
          className={`text-[10px] font-semibold tracking-[0.12em] uppercase ${
            selectedStock > 0
              ? "text-[#66715b]"
              : "text-[#9a655d]"
          }`}
        >
          {selectedStock > 0
            ? `${selectedStock} in stock`
            : "Sold out"}
        </span>
      </div>

      <button
        type="button"
        disabled={
          selectedStock <= 0 || stockLimitReached
        }
        onClick={handleAddToCart}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#181512] px-7 text-sm font-semibold text-white transition hover:bg-[#35302b] disabled:cursor-not-allowed disabled:bg-[#8b847b]"
      >
        {buttonLabel}
      </button>

      {quantityInCart > 0 && (
        <p className="mt-3 text-center text-[11px] text-[#776f67]">
          {quantityInCart} of this option currently in your cart.
        </p>
      )}
    </div>
  );
}
