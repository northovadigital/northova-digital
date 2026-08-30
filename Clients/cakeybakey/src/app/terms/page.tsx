import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Farhana & Kulsoom",
  description:
    "Terms and Conditions for shopping with Farhana & Kulsoom (F&K Boutique) in Karachi, Pakistan.",
};

export default function TermsPage() {
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
          Terms & Conditions
        </h1>

        <p className="mt-4 text-sm text-[#746d65]">
          Last updated: August 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-[#514b45]">
          <section>
            <h2 className="font-serif text-2xl text-[#181512]">
              1. Orders
            </h2>
            <p className="mt-3">
              An order is considered confirmed once the details have been
              verified by F&K Boutique. We may contact you by phone or
              WhatsApp to confirm an order before dispatch.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#181512]">
              2. Product information
            </h2>
            <p className="mt-3">
              We make reasonable efforts to display product descriptions,
              colours and images accurately. Minor differences may occur due
              to lighting, photography or screen settings.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#181512]">
              3. Pricing and availability
            </h2>
            <p className="mt-3">
              Prices and product availability may change without prior notice.
              If an item becomes unavailable after an order is placed, we will
              contact the customer and provide an appropriate resolution.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#181512]">
              4. Delivery
            </h2>
            <p className="mt-3">
              F&K Boutique currently delivers across Karachi. Delivery is
              currently offered free of charge within Karachi. Delivery timing
              may vary depending on location, order confirmation and courier
              availability.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#181512]">
              5. Customer responsibility
            </h2>
            <p className="mt-3">
              Customers are responsible for providing accurate contact and
              delivery information and for being available to receive a
              confirmed order.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
