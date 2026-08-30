import {
  Bike,
  ExternalLink,
  Phone,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import Container from "@/components/common/Container";

const orderingOptions = [
  {
    name: "Direct Pickup",
    description:
      "Call the restaurant and place your order directly for convenient pickup.",
    buttonText: "Call to Order",
    href: "tel:+17135550198",
    icon: Phone,
    external: false,
  },
  {
    name: "DoorDash",
    description:
      "Order your Bella Vista favorites for delivery through DoorDash.",
    buttonText: "Order on DoorDash",
    href: "https://www.doordash.com/",
    icon: Bike,
    external: true,
  },
  {
    name: "Uber Eats",
    description:
      "Get fresh Italian dishes delivered to your door through Uber Eats.",
    buttonText: "Order on Uber Eats",
    href: "https://www.ubereats.com/",
    icon: ShoppingBag,
    external: true,
  },
  {
    name: "Grubhub",
    description:
      "Browse the menu and place a delivery order through Grubhub.",
    buttonText: "Order on Grubhub",
    href: "https://www.grubhub.com/",
    icon: UtensilsCrossed,
    external: true,
  },
];

export default function Ordering() {
  return (
    <section
      id="order"
      className="scroll-mt-20 bg-[var(--primary)] py-20 md:py-28"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Order Online
          </p>

          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            Enjoy Bella Vista wherever you are.
          </h2>

          <p className="mt-5 leading-8 text-white/75">
            Choose pickup or order delivery through one of our trusted delivery
            partners.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {orderingOptions.map((option) => {
            const Icon = option.icon;

            return (
              <article
                key={option.name}
                className="flex flex-col rounded-3xl bg-white p-7 shadow-lg transition duration-300 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cream)] text-[var(--accent)]">
                  <Icon size={24} />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-[var(--primary)]">
                  {option.name}
                </h3>

                <p className="mt-3 flex-1 leading-7 text-[var(--muted)]">
                  {option.description}
                </p>

                <a
                  href={option.href}
                  target={option.external ? "_blank" : undefined}
                  rel={option.external ? "noreferrer" : undefined}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-center text-sm font-semibold text-white hover:opacity-90"
                >
                  {option.buttonText}

                  {option.external && <ExternalLink size={16} />}
                </a>
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-white/60">
          Delivery availability, service areas and fees are managed by the
          selected delivery partner.
        </p>
      </Container>
    </section>
  );
}
