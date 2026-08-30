import Link from "next/link";

export const metadata = {
  title: "Exchange Policy | Farhana & Kulsoom",
  description:
    "Exchange Policy for Farhana & Kulsoom (F&K Boutique), Karachi.",
};

export default function ExchangePolicyPage() {
  return (
    <main className="min-h-screen bg-[#fffdf9] px-5 py-16 sm:px-8 lg:px-10">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm text-[#927447] hover:underline"
        >
          ← Back to F&K Boutique
        </Link>

        <p className="mt-10 text-[10px] font-semibold tracking-[0.22em] text-[#9a7c50] uppercase">
          F&K Boutique
        </p>

        <h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] text-[#181512] sm:text-5xl">
          Exchange Policy
        </h1>

        <p className="mt-4 text-sm text-[#746d65]">
          Last updated: August 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-[#514b45]">
          <section>
            <h2 className="font-serif text-2xl text-[#181512]">
              1. Exchange window
            </h2>
            <p className="mt-3">
              We offer exchanges within 7 days of delivery for eligible
              products. Please contact us as soon as possible if you need an
              exchange.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#181512]">
              2. Exchange conditions
            </h2>
            <p className="mt-3">
              Items must be unused, unworn, unwashed and returned in their
              original condition with original packaging, tags and accessories
              where applicable.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#181512]">
              3. Eligible reasons
            </h2>
            <p className="mt-3">
              Exchanges may be considered for size issues, incorrect items or
              products that arrive damaged or defective. For a damaged or
              incorrect item, please contact us promptly with clear photos.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#181512]">
              4. Non-exchangeable items
            </h2>
            <p className="mt-3">
              Used, worn, washed or damaged items caused by customer handling
              are not eligible for exchange. Fragrances and other hygiene-
              sensitive products may also be excluded once opened or used.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#181512]">
              5. No cash refunds
            </h2>
            <p className="mt-3">
              F&K Boutique currently does not offer cash refunds. Approved
              cases are handled through exchange, subject to product
              availability and the conditions above.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#181512]">
              6. Exchange process
            </h2>
            <p className="mt-3">
              Contact us at 03708878409 or 03362276994 with your order details.
              Our team will guide you through the exchange process and confirm
              whether the requested item is available.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
