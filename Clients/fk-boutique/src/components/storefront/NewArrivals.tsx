import Link from "next/link";

import { ProductVisual } from "@/components/storefront/ProductVisual";
import { featuredProducts } from "@/data/products";
import { getProductDisplayPrice } from "@/lib/product";

const categoryLabels: Record<string, string> = {
  fashion: "Women's Fashion",
  fragrances: "Fragrance",
  home: "Home & Living",
};

export function NewArrivals() {
  return (
    <section className="bg-[#f4f0e9] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-[10px] font-semibold tracking-[0.22em] text-[#9b7d50] uppercase">
              New arrivals
            </p>

            <h2 className="font-serif text-4xl tracking-[-0.045em] text-[#181512] sm:text-5xl">
              Freshly added to F&K.
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-[#29231e] transition hover:text-[#927447]"
          >
            View all products
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <article key={product.id} className="group">
              <Link
                href="/shop"
                className="block overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a7c50]"
                aria-label={`View ${product.name}`}
              >
                <div className="relative overflow-hidden">
                  <ProductVisual category={product.category} />

                  <div className="absolute left-3 top-3 rounded-full bg-[#fffdf9]/90 px-3 py-1.5 text-[8px] font-semibold tracking-[0.14em] text-[#4f473f] uppercase backdrop-blur-sm sm:left-4 sm:top-4 sm:text-[9px]">
                    New
                  </div>

                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#181512] px-4 py-3 text-center text-xs font-semibold text-white transition-transform duration-300 group-hover:translate-y-0">
                    View product
                  </div>
                </div>
              </Link>

              <div className="pt-4">
                <p className="text-[9px] font-semibold tracking-[0.15em] text-[#9a7c50] uppercase">
                  {categoryLabels[product.category]}
                </p>

                <div className="mt-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                  <h3 className="font-serif text-lg leading-tight tracking-[-0.025em] text-[#211d19] sm:text-xl">
                    {product.name}
                  </h3>

                  <p className="shrink-0 text-sm font-semibold text-[#332d27]">
                    {getProductDisplayPrice(product)}
                  </p>
                </div>

                <p className="mt-2 hidden max-w-md text-sm leading-6 text-[#746d65] sm:block">
                  {product.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
