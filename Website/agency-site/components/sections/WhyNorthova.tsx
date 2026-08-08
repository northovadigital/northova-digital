import { Reveal } from "@/components/motion/Reveal";

const reasons = [
  {
    number: "01",
    title: "Business-first thinking",
    description:
      "We start with what the website needs to achieve for the business, then shape the design and technology around that objective.",
  },
  {
    number: "02",
    title: "Clear, direct communication",
    description:
      "You should always understand what is being built, why a decision was made and what the next step is.",
  },
  {
    number: "03",
    title: "Modern without unnecessary complexity",
    description:
      "We use modern technology and polished design without adding features, tools or processes that do not create real value.",
  },
  {
    number: "04",
    title: "Built for what comes next",
    description:
      "The website is structured so future pages, campaigns, content and business requirements can grow without starting over.",
  },
];

export function WhyNorthova() {
  return (
    <section className="v3-why">
      <div className="shell">
        <div className="v3-why-layout">
          <div className="v3-why-heading">
            <Reveal>
              <div className="v2-section-kicker">
                <span />
                Why Northova
              </div>

              <h2>
                Professional delivery without
                <span> unnecessary agency friction.</span>
              </h2>

              <p>
                Good digital work is not only about how the final website looks.
                The thinking, communication and decisions behind it matter just
                as much.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <div className="v3-why-statement">
                <span>Our approach</span>

                <strong>
                  Strategy
                  <i>→</i>
                  Clarity
                  <i>→</i>
                  Experience
                  <i>→</i>
                  Growth
                </strong>
              </div>
            </Reveal>
          </div>

          <div className="v3-why-grid">
            {reasons.map((reason, index) => (
              <Reveal key={reason.number} delay={index * 70}>
                <article className="v3-why-card">
                  <div>
                    <span>{reason.number}</span>
                    <span className="v3-why-dot" />
                  </div>

                  <h3>{reason.title}</h3>
                  <p>{reason.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
