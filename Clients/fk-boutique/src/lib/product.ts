import { formatPrice } from "@/lib/currency";
import type { Product } from "@/types/product";

export function getTotalStock(product: Product): number {
  return product.variants.reduce(
    (total, variant) => total + variant.stock,
    0,
  );
}

export function getStartingPrice(product: Product): number {
  const prices = product.variants.map(
    (variant) => variant.price ?? product.price,
  );

  return Math.min(product.price, ...prices);
}

export function hasVariablePricing(product: Product): boolean {
  const prices = new Set(
    product.variants.map(
      (variant) => variant.price ?? product.price,
    ),
  );

  return prices.size > 1;
}

export function getProductDisplayPrice(product: Product): string {
  const price = formatPrice(getStartingPrice(product));

  return hasVariablePricing(product)
    ? `From ${price}`
    : price;
}
