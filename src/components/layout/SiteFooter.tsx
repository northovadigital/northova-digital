import Link from "next/link";

import { storeConfig } from "@/config/store";

const shopLinks = [
  { label: "All Products", href: "/shop" },
  { label: "Women's Fashion", href: "/shop?category=fashion" },
  { label: "Fragrances", href: "/shop?category=fragrances" },
  { label: "Home & Living", href: "/shop?category=home" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#ded7cd] bg-[#fffdf9] px-5 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_0.8fr_0.8fr] lg:py-16">
          <div>
            <div className="font-serif text-4xl tracking-[-0.045em] text-[#181512]">
              {storeConfig.shortName}
            </div>

            <div className="mt-2 text-[9px] font-semibold tracking-[0.24em] text-[#9a7c50] uppercase">
              {storeConfig.name}
            </div>

            <p className="mt-5 max-w-sm text-sm leading-6 text-[#746d65]">
              Fashion, fragrances and home essentials curated in Karachi for
              modern everyday living.
            </p>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.18em] text-[#9a7c50] uppercase">
              Shop
            </h3>

            <div className="mt-4 flex flex-col">
              {shopLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex min-h-10 items-center text-sm text-[#514b45] transition hover:text-[#927447]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.18em] text-[#9a7c50] uppercase">
              Customer care
            </h3>

            <div className="mt-4 space-y-3 text-sm leading-6 text-[#625c55]">
              <p>Cash on delivery</p>
              <p>Direct order confirmation</p>
              <p>Karachi delivery</p>
              <p>WhatsApp support coming soon</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#e2dcd2] py-6 text-xs text-[#877f76] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p>
              © 2026 {storeConfig.name}. All rights reserved.
            </p>

            <span aria-hidden="true">·</span>

            <a
              href="https://northovadigital.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:opacity-70"
            >
              Designed by Northova Digital
            </a>
          </div>

          <p>Karachi, Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
