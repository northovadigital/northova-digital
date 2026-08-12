import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ProductVisual } from "@/components/storefront/ProductVisual";
import { ProductVariantSelector } from "@/components/storefront/ProductVariantSelector";
import { featuredProducts } from "@/data/products";
import type { Product } from "@/types/product";

type ProductPageParams = Promise<{
  slug: string;
}>;

const categoryLabels: Record<string, string> = {
  fashion: "Women's Fashion",
  fragrances: "Fragrances",
  home: "Home & Living",
};

function getProduct(slug: string): Product | undefined {
  return featuredProducts.find(
    (product) => product.slug === slug,
  );
}

export function generateStaticParams() {
  return featuredProducts.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: ProductPageParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: ProductPageParams;
}) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />

      <main className="bg-[#f7f4ee]">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="/shop"
            className="inline-flex min-h-10 items-center text-xs font-semibold text-[#71685f] transition hover:text-[#927447]"
          >
            ← Back to collection
          </Link>
        </div>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-10 lg:pb-24">
          <div className="overflow-hidden rounded-lg">
            <ProductVisual
              category={product.category}
              variantKey={product.slug}
            />
          </div>

          <div className="flex items-center">
            <div className="w-full max-w-xl">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#9a7c50] uppercase">
                {categoryLabels[product.category]}
              </p>

              <h1 className="mt-3 font-serif text-4xl leading-[1.02] tracking-[-0.045em] text-[#181512] sm:text-5xl">
                {product.name}
              </h1>

              <p className="mt-6 text-base leading-7 text-[#6d655e]">
                {product.description}
              </p>

              <div className="mt-8">
                <ProductVariantSelector
                  category={product.category}
                  basePrice={product.price}
                  variants={product.variants}
                />
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-[#d8cfc1] bg-[#fffdf9] p-4">
                  <p className="text-[9px] font-semibold tracking-[0.16em] text-[#9a7c50] uppercase">
                    Payment
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#332d27]">
                    Cash on delivery
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#756d65]">
                    Pay when your order is delivered.
                  </p>
                </div>

                <div className="rounded-lg border border-[#d8cfc1] bg-[#fffdf9] p-4">
                  <p className="text-[9px] font-semibold tracking-[0.16em] text-[#9a7c50] uppercase">
                    Confirmation
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#332d27]">
                    Personally confirmed
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#756d65]">
                    We confirm every order directly before delivery.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-lg bg-[#ebe5db] p-5">
                <p className="text-sm font-semibold text-[#332d27]">
                  Ordering through cart is the next step.
                </p>

                <p className="mt-1 text-xs leading-5 text-[#756d65]">
                  Product selection is ready. Cart and COD checkout will be
                  connected in the next development phase.
                </p>
              </div>

              <Link
                href="/shop"
                className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full border border-[#c6b9a6] px-7 text-sm font-semibold text-[#332d27] transition hover:border-[#9a7c50] hover:bg-[#fffdf9]"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
