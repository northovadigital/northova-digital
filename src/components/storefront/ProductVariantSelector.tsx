"use client";

import { useState } from "react";

import { formatPrice } from "@/lib/currency";
import type { ProductVariant } from "@/types/product";

type ProductVariantSelectorProps = {
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

  if (variant.color) {
    return variant.color;
  }

  return null;
}

export function ProductVariantSelector({
  category,
  basePrice,
  variants,
}: ProductVariantSelectorProps) {
  const initialVariant =
    variants.find((variant) => variant.stock > 0) ??
    variants[0];

  const [selectedVariantId, setSelectedVariantId] = useState(
    initialVariant?.id ?? "",
  );

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

  const selectorLabel =
    category === "fragrances"
      ? "Bottle size"
      : "Select size";

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
                  onClick={() =>
                    setSelectedVariantId(variant.id)
                  }
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
    </div>
  );
}
