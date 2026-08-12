import type { Metadata } from "next";
import Link from "next/link";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ProductCard } from "@/components/storefront/ProductCard";
import { featuredProducts } from "@/data/products";
import type { Product } from "@/types/product";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop women's fashion, fragrances and home essentials from Farhana & Kulsoom.",
};

type ShopSearchParams = Promise<{
  category?: string | string[];
  sort?: string | string[];
  q?: string | string[];
}>;

const categoryOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Women's Fashion",
    value: "fashion",
  },
  {
    label: "Fragrances",
    value: "fragrances",
  },
  {
    label: "Home & Living",
    value: "home",
  },
];

const sortOptions = [
  {
    label: "Featured",
    value: "featured",
  },
  {
    label: "Price: Low to High",
    value: "price-asc",
  },
  {
    label: "Price: High to Low",
    value: "price-desc",
  },
  {
    label: "Newest",
    value: "newest",
  },
];

function getFirstValue(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function filterProducts(
  products: Product[],
  category: string,
  query: string,
): Product[] {
  const normalizedQuery = query.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory =
      category === "all" || product.category === category;

    const matchesSearch =
      normalizedQuery.length === 0 ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });
}

function sortProducts(products: Product[], sort: string): Product[] {
  return [...products].sort((first, second) => {
    if (sort === "price-asc") {
      return first.price - second.price;
    }

    if (sort === "price-desc") {
      return second.price - first.price;
    }

    if (sort === "newest") {
      return (
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime()
      );
    }

    return Number(second.featured) - Number(first.featured);
  });
}

function buildShopHref({
  category,
  sort,
  query,
}: {
  category?: string;
  sort?: string;
  query?: string;
}): string {
  const params = new URLSearchParams();

  if (category && category !== "all") {
    params.set("category", category);
  }

  if (sort && sort !== "featured") {
    params.set("sort", sort);
  }

  if (query) {
    params.set("q", query);
  }

  const search = params.toString();

  return search ? `/shop?${search}` : "/shop";
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: ShopSearchParams;
}) {
  const params = await searchParams;

  const requestedCategory = getFirstValue(params.category) ?? "all";
  const requestedSort = getFirstValue(params.sort) ?? "featured";
  const query = getFirstValue(params.q) ?? "";

  const validCategory = categoryOptions.some(
    (option) => option.value === requestedCategory,
  )
    ? requestedCategory
    : "all";

  const validSort = sortOptions.some(
    (option) => option.value === requestedSort,
  )
    ? requestedSort
    : "featured";

  const filteredProducts = filterProducts(
    featuredProducts,
    validCategory,
    query,
  );

  const products = sortProducts(filteredProducts, validSort);

  const activeCategory =
    categoryOptions.find(
      (option) => option.value === validCategory,
    )?.label ?? "All";

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />

      <main className="bg-[#f7f4ee]">
        <section className="border-b border-[#ddd5ca] bg-[#eee8df] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <p className="text-[10px] font-semibold tracking-[0.22em] text-[#9b7d50] uppercase">
              F&K Collection
            </p>

            <div className="mt-3 grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <h1 className="max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.05em] text-[#181512] sm:text-6xl">
                Find something
                <span className="italic text-[#8d7655]">
                  {" "}
                  worth keeping.
                </span>
              </h1>

              <p className="max-w-lg text-sm leading-6 text-[#6f675f] lg:justify-self-end">
                Browse our current selection across women&apos;s fashion,
                fragrances and home essentials.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-10 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <form
              action="/shop"
              method="get"
              className="grid gap-3 border-b border-[#ddd5ca] pb-7 lg:grid-cols-[1fr_auto]"
            >
              <div className="flex min-h-12 overflow-hidden rounded-full border border-[#cfc5b6] bg-[#fffdf9]">
                {validCategory !== "all" && (
                  <input
                    type="hidden"
                    name="category"
                    value={validCategory}
                  />
                )}

                {validSort !== "featured" && (
                  <input
                    type="hidden"
                    name="sort"
                    value={validSort}
                  />
                )}

                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Search products"
                  aria-label="Search products"
                  className="min-w-0 flex-1 bg-transparent px-5 text-sm text-[#28231f] outline-none placeholder:text-[#948b82]"
                />

                <button
                  type="submit"
                  className="m-1 inline-flex min-h-10 items-center justify-center rounded-full bg-[#181512] px-5 text-sm font-semibold !text-white transition hover:bg-[#37322c]"
                >
                  Search
                </button>
              </div>

              {query && (
                <Link
                  href={buildShopHref({
                    category: validCategory,
                    sort: validSort,
                  })}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#cfc5b6] px-5 text-sm font-semibold text-[#38312b]"
                >
                  Clear search
                </Link>
              )}
            </form>

            <div className="mt-7">
              <p className="mb-3 text-[9px] font-semibold tracking-[0.16em] text-[#8f7858] uppercase">
                Category
              </p>

              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
                {categoryOptions.map((option) => {
                  const active = option.value === validCategory;

                  return (
                    <Link
                      key={option.value}
                      href={buildShopHref({
                        category: option.value,
                        sort: validSort,
                        query,
                      })}
                      className={`inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border px-5 text-sm font-medium transition ${
                        active
                          ? "border-[#181512] bg-[#181512] !text-white"
                          : "border-[#cfc5b6] bg-[#fffdf9] text-[#514a43] hover:border-[#9e835a]"
                      }`}
                    >
                      {option.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-[9px] font-semibold tracking-[0.16em] text-[#8f7858] uppercase">
                Sort by
              </p>

              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
                {sortOptions.map((option) => {
                  const active = option.value === validSort;

                  return (
                    <Link
                      key={option.value}
                      href={buildShopHref({
                        category: validCategory,
                        sort: option.value,
                        query,
                      })}
                      className={`inline-flex min-h-10 shrink-0 items-center justify-center rounded-full px-4 text-xs font-medium transition ${
                        active
                          ? "bg-[#ded5c8] text-[#211d19]"
                          : "text-[#776f67] hover:bg-[#ece6dd]"
                      }`}
                    >
                      {option.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2 border-y border-[#ddd5ca] py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#29231f]">
                  {activeCategory}
                </p>

                {query && (
                  <p className="mt-1 text-xs text-[#80776e]">
                    Search results for &ldquo;{query}&rdquo;
                  </p>
                )}
              </div>

              <p className="text-xs font-medium text-[#80776e]">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"}
              </p>
            </div>

            {products.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[#9b7d50] uppercase">
                  No matches
                </p>

                <h2 className="mt-3 font-serif text-3xl tracking-[-0.035em] text-[#211d19]">
                  We couldn&apos;t find that product.
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#746d65]">
                  Try another search or browse the complete F&K collection.
                </p>

                <Link
                  href="/shop"
                  className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[#181512] px-7 text-sm font-semibold !text-white"
                >
                  View all products
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
