import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Farhana & Kulsoom",
  description:
    "Privacy Policy for Farhana & Kulsoom (F&K Boutique), a Karachi-based Pakistani boutique.",
};

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>

        <p className="mt-4 text-sm text-[#746d65]">
          Last updated: August 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-[#514b45]">
          <section>
            <h2 className="font-serif text-2xl text-[#181512]">
              1. Information we collect
            </h2>
            <p className="mt-3">
              When you place an order with Farhana & Kulsoom, we may collect
              information such as your name, phone number, delivery address,
              order details and information you provide when contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#181512]">
              2. How we use your information
            </h2>
            <p className="mt-3">
              We use customer information to process and confirm orders,
              arrange delivery, communicate about your purchase, provide
              customer support and maintain our store operations.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#181512]">
              3. Information sharing
            </h2>
            <p className="mt-3">
              We do not sell customer information. Information may be shared
              with delivery or service providers only when reasonably required
              to fulfil an order or provide a requested service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#181512]">
              4. Data security
            </h2>
            <p className="mt-3">
              We take reasonable measures to protect customer information.
              However, no online system can be guaranteed to be completely
              secure.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#181512]">
              5. Contact
            </h2>
            <p className="mt-3">
              For privacy-related questions, contact F&K Boutique in Karachi
              at 03708878409 or 03362276994.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
