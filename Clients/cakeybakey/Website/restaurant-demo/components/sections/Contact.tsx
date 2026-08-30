import {
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Container from "@/components/common/Container";

const contactDetails = [
  {
    title: "Visit Us",
    value: "1800 Westheimer Road, Houston, TX 77098",
    href: "https://www.google.com/maps/search/?api=1&query=1800+Westheimer+Road+Houston+TX+77098",
    icon: MapPin,
    external: true,
  },
  {
    title: "Call Us",
    value: "(713) 555-0198",
    href: "tel:+17135550198",
    icon: Phone,
    external: false,
  },
  {
    title: "Email Us",
    value: "hello@bellavistakitchen.com",
    href: "mailto:hello@bellavistakitchen.com",
    icon: Mail,
    external: false,
  },
  {
    title: "Opening Hours",
    value: "Monday – Sunday: 11:00 AM – 10:00 PM",
    href: null,
    icon: Clock3,
    external: false,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-20 bg-white py-20 md:py-28"
    >
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
              Contact & Location
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[var(--primary)] md:text-5xl">
              Come dine with us.
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-[var(--muted)]">
              Visit Bella Vista for authentic Italian food, warm hospitality
              and a memorable dining experience in Houston.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {contactDetails.map((detail) => {
                const Icon = detail.icon;

                return (
                  <div key={detail.title} className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--cream)] text-[var(--accent)]">
                      <Icon size={21} />
                    </div>

                    <div>
                      <h3 className="font-bold text-[var(--primary)]">
                        {detail.title}
                      </h3>

                      {detail.href ? (
                        <a
                          href={detail.href}
                          target={detail.external ? "_blank" : undefined}
                          rel={detail.external ? "noreferrer" : undefined}
                          className="mt-2 inline-flex items-center gap-1 text-sm leading-6 text-[var(--muted)] hover:text-[var(--accent)]"
                        >
                          {detail.value}

                          {detail.external && <ExternalLink size={14} />}
                        </a>
                      ) : (
                        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                          {detail.value}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-black/10 bg-[var(--cream)]">
            <iframe
              title="Bella Vista Italian Kitchen location"
              src="https://www.google.com/maps?q=1800%20Westheimer%20Road%20Houston%20TX%2077098&output=embed"
              className="h-[420px] w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
