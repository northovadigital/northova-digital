import Link from "next/link";

import { CategoryVisual } from "@/components/storefront/CategoryVisual";
import { storeCategories } from "@/data/categories";

const categoryStyles = [
  {
    card: "bg-[#ded5c8]",
    label: "text-[#675c50]",
    title: "text-[#211c18]",
    body: "text-[#625a52]",
    inverted: false,
  },
  {
    card: "bg-[#292723]",
    label: "text-[#c8aa78]",
    title: "text-[#f6f1e9]",
    body: "text-[#c0b9af]",
    inverted: true,
  },
  {
    card: "bg-[#bfc0ae]",
    label: "text-[#505345]",
    title: "text-[#20221d]",
    body: "text-[#55574d]",
    inverted: false,
  },
];

export function CategoryGrid() {
  return (
    <section
      id="categories"
      className="bg-[#fffdf9] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 grid gap-5 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="mb-3 text-[10px] font-semibold tracking-[0.22em] text-[#9b7d50] uppercase">
              The collection
            </p>

            <h2 className="max-w-2xl font-serif text-4xl tracking-[-0.045em] text-[#181512] sm:text-5xl">
              Three ways to discover F&K.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-[#746d65] md:justify-self-end">
            Explore pieces for your wardrobe, signature fragrances and
            thoughtfully selected essentials for your home.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {storeCategories.map((category, index) => {
            const style = categoryStyles[index];

            return (
              <Link
                key={category.id}
                href={category.href}
                className={`${style.card} group flex min-h-[470px] flex-col overflow-hidden rounded-lg p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(34,28,23,0.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a7c50] sm:p-7`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-semibold tracking-[0.22em] uppercase ${style.label}`}
                  >
                    {category.eyebrow}
                  </span>

                  <span
                    className={`text-[9px] font-medium tracking-[0.12em] uppercase ${style.label}`}
                  >
                    0{index + 1}
                  </span>
                </div>

                <div className="mt-2 flex flex-1 items-center">
                  <CategoryVisual
                    categoryId={category.id}
                    inverted={style.inverted}
                  />
                </div>

                <div>
                  <h3
                    className={`font-serif text-[32px] tracking-[-0.04em] ${style.title}`}
                  >
                    {category.name}
                  </h3>

                  <p
                    className={`mt-3 max-w-sm text-sm leading-6 ${style.body}`}
                  >
                    {category.shortDescription}
                  </p>

                  <div
                    className={`mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold ${style.title}`}
                  >
                    Explore collection

                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
