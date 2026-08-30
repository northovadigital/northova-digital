import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

const services = [
  {
    number: "01",
    symbol: "◫",
    title: "Web Design & Development",
    description:
      "Custom websites combining clear messaging, modern design and reliable development around your business goals.",
    outcome: "Build credibility",
  },
  {
    number: "02",
    symbol: "↻",
    title: "Website Redesign",
    description:
      "Transform an outdated or confusing website into a cleaner, faster and more effective customer experience.",
    outcome: "Modernize your presence",
  },
  {
    number: "03",
    symbol: "◇",
    title: "Restaurant & Hospitality",
    description:
      "Restaurant experiences designed around menus, reservations, ordering journeys, mobile users and local visibility.",
    outcome: "Turn visits into customers",
  },
  {
    number: "04",
    symbol: <ArrowUpRight className="v2-arrow-icon" />,
    title: "Landing Pages",
    description:
      "Focused pages for campaigns, services and offers where every section supports one meaningful customer action.",
    outcome: "Improve conversion",
  },
  {
    number: "05",
    symbol: "⌁",
    title: "SEO-Ready Websites",
    description:
      "Fast architecture, structured content and technical foundations designed to support sustainable search growth.",
    outcome: "Build visibility",
  },
  {
    number: "06",
    symbol: "◎",
    title: "Maintenance & Support",
    description:
      "Continuous improvements, updates and technical support after launch so the website keeps performing reliably.",
    outcome: "Protect your investment",
  },
];

export function Services() {
  return (
    <section className="v2-services" id="services">
      <div className="shell">
        <Reveal>
          <div className="v2-section-kicker">
            <span />
            What we do
          </div>
        </Reveal>

        <div className="v2-services-heading">
          <Reveal>
            <h2>
              More than a website.
              <span> A stronger digital business.</span>
            </h2>
          </Reveal>

          <Reveal delay={90}>
            <div>
              <p>
                We combine business thinking, visual design and modern
                development to create digital experiences that communicate value
                and make customer action easier.
              </p>

              <Link href="#contact">
                Discuss your project
                <span>
                  <ArrowUpRight className="v2-arrow-icon" />
                </span>
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="v2-services-grid">
          {services.map((service, index) => (
            <Reveal key={service.number} delay={index * 55}>
              <article className="v2-service-card">
                <div className="v2-service-header">
                  <span className="v2-service-number">{service.number}</span>
                  <span className="v2-service-symbol">{service.symbol}</span>
                </div>

                <h3>{service.title}</h3>
                <p>{service.description}</p>

                <div className="v2-service-outcome">
                  <span />
                  {service.outcome}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
