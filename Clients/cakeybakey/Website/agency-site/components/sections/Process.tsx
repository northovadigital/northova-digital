import { Reveal } from "@/components/motion/Reveal";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We understand your business, customer, current digital presence and the outcome the project needs to create.",
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "We shape positioning, content hierarchy, customer journeys and the technical direction before development begins.",
  },
  {
    number: "03",
    title: "Design & Build",
    description:
      "We turn the strategy into a responsive experience and develop it using modern, maintainable technology.",
  },
  {
    number: "04",
    title: "Launch & Improve",
    description:
      "We test, deploy and continue improving the experience as real business requirements evolve.",
  },
];

export function Process() {
  return (
    <section className="v2-process" id="process">
      <div className="shell">
        <Reveal>
          <div className="v2-section-kicker">
            <span />
            Our process
          </div>

          <div className="v2-process-heading">
            <h2>
              Clear from first conversation
              <span> to final launch.</span>
            </h2>

            <p>
              Good project delivery should never feel mysterious. Our process
              keeps the objective, responsibilities and next decision visible.
            </p>
          </div>
        </Reveal>

        <div className="v2-process-track">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 80}>
              <article className="v2-process-card">
                <span className="v2-process-number">{step.number}</span>

                <div className="v2-process-circle">
                  <span />
                </div>

                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
