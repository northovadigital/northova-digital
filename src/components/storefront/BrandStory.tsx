import Link from "next/link";

export function BrandStory() {
  return (
    <section className="bg-[#1e1c19] px-5 py-16 text-[#f6f1e9] sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div className="relative min-h-[390px] overflow-hidden border border-white/15 bg-[#2b2925]">
          <div className="absolute left-7 top-7 text-[10px] font-semibold tracking-[0.24em] text-[#c3a675] uppercase">
            Farhana & Kulsoom
          </div>

          <div className="absolute right-6 top-4 font-serif text-7xl text-white/[0.06]">
            F&K
          </div>

          <div className="absolute left-[15%] top-[28%] h-44 w-36 border border-white/15" />
          <div className="absolute left-[32%] top-[38%] h-44 w-36 border border-[#c3a675]/25" />
          <div className="absolute right-[12%] top-[20%] h-44 w-36 border border-white/10" />

          <div className="absolute inset-x-7 bottom-7 border-t border-white/10 pt-5">
            <p className="font-serif text-3xl leading-tight tracking-[-0.035em]">
              Thoughtfully selected.
              <span className="block italic text-[#c3a675]">
                Personally presented.
              </span>
            </p>
          </div>
        </div>

        <div className="max-w-2xl lg:pl-10">
          <p className="mb-4 text-[10px] font-semibold tracking-[0.22em] text-[#c3a675] uppercase">
            Our point of view
          </p>

          <h2 className="font-serif text-4xl leading-[1.02] tracking-[-0.045em] sm:text-5xl">
            Everyday pieces should still feel considered.
          </h2>

          <p className="mt-6 text-base leading-7 text-[#bdb6ad]">
            F&K brings fashion, fragrance and home essentials together through a
            simple idea: offer pieces that feel useful, refined and easy to
            enjoy in everyday life.
          </p>

          <p className="mt-4 text-base leading-7 text-[#bdb6ad]">
            Our collection will continue to evolve, but the focus stays the same
            — thoughtful selection, direct service and a straightforward
            shopping experience.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-[#c3a675]/60 px-7 text-sm font-semibold text-[#f6f1e9] transition hover:border-[#c3a675] hover:bg-[#c3a675] hover:text-[#181512]"
          >
            Discover F&K
          </Link>
        </div>
      </div>
    </section>
  );
}
