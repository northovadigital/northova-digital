import Link from "next/link";

import { ProductVisual } from "@/components/storefront/ProductVisual";
import { getProductDisplayPrice, getTotalStock } from "@/lib/product";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

const categoryLabels: Record<string, string> = {
  fashion: "Women's Fashion",
  fragrances: "Fragrance",
  home: "Home & Living",
};

export function ProductCard({ product }: ProductCardProps) {
  const stock = getTotalStock(product);
  const soldOut = product.status === "sold_out" || stock <= 0;

  return (
    <article className="group">
      <Link
        href={`/products/${product.slug}`}
        className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a7c50]"
      >
        <div className="relative overflow-hidden rounded-lg">
          <ProductVisual
            category={product.category}
            variantKey={product.slug}
          />

          <div className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-4 sm:top-4">
            {product.featured && (
              <span className="rounded-full bg-[#fffdf9]/92 px-3 py-1.5 text-[8px] font-semibold tracking-[0.14em] text-[#4f473f] uppercase backdrop-blur-sm">
                Featured
              </span>
            )}

            {soldOut && (
              <span className="rounded-full bg-[#181512] px-3 py-1.5 text-[8px] font-semibold tracking-[0.14em] text-white uppercase">
                Sold out
              </span>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#181512] px-4 py-3 text-center text-xs font-semibold text-white transition-transform duration-300 group-hover:translate-y-0">
            View product
          </div>
        </div>
      </Link>

      <div className="pt-4">
        <p className="text-[9px] font-semibold tracking-[0.15em] text-[#9a7c50] uppercase">
          {categoryLabels[product.category] ?? product.category}
        </p>

        <div className="mt-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
          <Link
            href={`/products/${product.slug}`}
            className="font-serif text-lg leading-tight tracking-[-0.025em] text-[#211d19] transition hover:text-[#927447] sm:text-xl"
          >
            {product.name}
          </Link>

          <p className="shrink-0 text-sm font-semibold text-[#332d27]">
            {getProductDisplayPrice(product)}
          </p>
        </div>

        <p className="mt-2 text-sm leading-6 text-[#746d65]">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-[#ddd5ca] pt-3">
          <span
            className={`text-[10px] font-semibold tracking-[0.1em] uppercase ${
              soldOut ? "text-[#9a655d]" : "text-[#68745d]"
            }`}
          >
            {soldOut ? "Unavailable" : `${stock} in stock`}
          </span>

          <Link
            href={`/products/${product.slug}`}
            className="text-xs font-semibold text-[#39332d] transition hover:text-[#927447]"
          >
            View details →
          </Link>
        </div>
      </div>
    </article>
  );
}
