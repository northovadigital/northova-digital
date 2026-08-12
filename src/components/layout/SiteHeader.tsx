import Link from "next/link";

import { storeConfig } from "@/config/store";

const navigation = [
  { label: "New Arrivals", href: "/shop" },
  { label: "Fashion", href: "/shop?category=fashion" },
  { label: "Fragrances", href: "/shop?category=fragrances" },
  { label: "Home", href: "/shop?category=home" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#ddd5c9] bg-[#fffdf9]/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a7c50]"
          aria-label={`${storeConfig.name} home`}
        >
          <div className="leading-none">
            <div className="font-serif text-[30px] tracking-[-0.045em] text-[#181512]">
              {storeConfig.shortName}
            </div>

            <div className="mt-1.5 text-[8px] font-semibold tracking-[0.24em] text-[#9a7c50] uppercase">
              {storeConfig.name}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-sm py-3 text-[13px] font-medium text-[#554f48] transition-colors hover:text-[#927447] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a7c50]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/shop"
            className="hidden min-h-11 items-center justify-center rounded-full border border-[#cfc5b6] px-5 text-sm font-medium text-[#241e19] transition hover:border-[#9f835a] hover:bg-[#f7f2e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7c50] sm:inline-flex"
          >
            Shop
          </Link>

          <Link
            href="/cart"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#181512] px-5 text-sm font-medium text-white transition hover:bg-[#35302b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7c50]"
          >
            Cart · 0
          </Link>

          <details className="group relative lg:hidden">
            <summary className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-full border border-[#cfc5b6] text-[#211d19] [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Open navigation</span>

              <span className="flex w-4 flex-col gap-[5px]" aria-hidden="true">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-full bg-current" />
              </span>
            </summary>

            <nav className="absolute right-0 top-[54px] w-60 overflow-hidden rounded-xl border border-[#ddd5c9] bg-[#fffdf9] p-2 shadow-[0_18px_50px_rgba(30,24,20,0.12)]">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex min-h-11 items-center rounded-lg px-4 text-sm font-medium text-[#453f39] transition hover:bg-[#f2ede5]"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/shop"
                className="mt-1 flex min-h-11 items-center rounded-lg bg-[#181512] px-4 text-sm font-medium text-white"
              >
                Shop all
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
