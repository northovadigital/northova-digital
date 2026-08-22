import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="overflow-hidden bg-[#f7f4ee]">
      <div className="mx-auto grid max-w-7xl lg:min-h-[585px] lg:grid-cols-[1.02fr_0.98fr]">
        <div className="flex items-center px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-16">
          <div className="max-w-2xl">
            <p className="mb-5 text-[10px] font-semibold tracking-[0.24em] text-[#9b7d50] uppercase sm:text-[11px]">
              Curated lifestyle essentials
            </p>

            <h1 className="font-serif text-[52px] leading-[0.95] tracking-[-0.055em] text-[#181512] sm:text-6xl lg:text-[72px]">
              Fashion.
              <span className="block">Fragrance.</span>
              <span className="block italic text-[#8d7655]">Home.</span>
            </h1>

            <p className="mt-6 max-w-[570px] text-base leading-7 text-[#696159] sm:text-[17px]">
              A refined edit of clothing, signature scents and home essentials
              chosen for modern everyday living.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#181512] px-7 text-sm font-semibold text-white transition hover:bg-[#35302b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7c50]"
              >
                Explore collection
              </Link>

              <Link
                href="#categories"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#c9bda9] px-7 text-sm font-semibold text-[#29231e] transition hover:border-[#9f835a] hover:bg-[#fffdf9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7c50]"
              >
                Shop by category
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 border-t border-[#ddd4c7] pt-5">
              <div>
                <div className="text-[9px] font-semibold tracking-[0.15em] text-[#a18152] uppercase">
                  Based in
                </div>
                <div className="mt-1 text-xs font-medium text-[#5d554e]">
                  Karachi
                </div>
              </div>

              <div className="border-l border-[#ddd4c7] pl-5">
                <div className="text-[9px] font-semibold tracking-[0.15em] text-[#a18152] uppercase">
                  Payment
                </div>
                <div className="mt-1 text-xs font-medium text-[#5d554e]">
                  Cash on delivery
                </div>
              </div>

              <div className="border-l border-[#ddd4c7] pl-5">
                <div className="text-[9px] font-semibold tracking-[0.15em] text-[#a18152] uppercase">
                  Service
                </div>
                <div className="mt-1 text-xs font-medium text-[#5d554e]">
                  Direct confirmation
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[520px] overflow-hidden bg-[#cbc0ae] lg:min-h-full">
          <Image
            src="/images/hero.jpg"
            alt="F&K curated fashion, fragrance and home collection"
            fill
            priority
            className="z-0 object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />

          <div className="absolute inset-0 z-10 bg-black/10" />

          <div className="absolute inset-6 z-20 border border-white/40 sm:inset-10">

            <div className="absolute left-6 top-6 text-[9px] font-semibold tracking-[0.24em] text-[#51493f] uppercase">
              The F&K Edit
            </div>

            <div className="absolute right-6 top-4 font-serif text-6xl text-white/35">
              F&K
            </div>

            <div className="absolute left-[9%] top-[24%] w-[27%]">
              <div className="mb-3 text-[8px] font-semibold tracking-[0.18em] text-[#645b50] uppercase">
                Fashion
              </div>
            </div>

            <div className="absolute left-[37%] top-[13%] w-[27%]">
              <div className="mb-3 text-[8px] font-semibold tracking-[0.18em] text-[#645b50] uppercase">
                Fragrance
              </div>
            </div>

            <div className="absolute right-[8%] top-[29%] w-[27%]">
              <div className="mb-3 text-[8px] font-semibold tracking-[0.18em] text-[#645b50] uppercase">
                Home
              </div>
            </div>

            <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[9px] font-semibold tracking-[0.2em] text-[#665d52] uppercase">
                  Curated for everyday living
                </p>

                <div className="mt-2 max-w-xs font-serif text-3xl leading-[1.04] tracking-[-0.035em] text-[#201b17] sm:text-4xl">
                  Three collections.
                  <span className="block italic text-[#75634c]">
                    One point of view.
                  </span>
                </div>
              </div>

              <div className="hidden text-right text-[9px] font-medium leading-5 tracking-[0.12em] text-[#61584e] uppercase sm:block">
                Wardrobe
                <br />
                Scent
                <br />
                Home
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
