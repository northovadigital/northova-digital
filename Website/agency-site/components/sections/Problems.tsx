import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

const problems = [
  {
    number: "01",
    title: "Your website looks outdated",
    description:
      "A dated visual experience can weaken trust before a customer even understands what your business offers.",
    tag: "Credibility",
  },
  {
    number: "02",
    title: "Visitors cannot find what they need",
    description:
      "Weak navigation, unclear messaging and buried actions create friction that pushes good prospects away.",
    tag: "User experience",
  },
  {
    number: "03",
    title: "Traffic arrives but does not convert",
    description:
      "A website without clear journeys and meaningful calls to action often leaves business opportunities on the table.",
    tag: "Conversion",
  },
  {
    number: "04",
    title: "Your online presence cannot grow with you",
    description:
      "Poor structure, weak search foundations and rigid systems make future campaigns and expansion harder.",
    tag: "Growth",
  },
];

export function Problems() {
  return (
    <section className="v2-problems">
      <div className="shell">
        <Reveal>
          <div className="v2-section-kicker">
            <span />
            The real problem
          </div>
        </Reveal>

        <div className="v2-problems-heading">
          <Reveal>
            <h2>
              Your website should be a
              <span> business asset,</span>
              <br />
              not just an online brochure.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <div className="v2-problems-intro">
              <p>
                Customers make fast decisions online.
                We design around the moments that shape
                trust, clarity and action.
              </p>

              <Link href="#contact">
                Find out what your website is missing
                <span>↗</span>
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="v2-problem-grid">
          {problems.map((problem, index) => (
            <Reveal
              key={problem.number}
              delay={index * 80}
            >
              <article className="v2-problem-card">
                <div className="v2-problem-top">
                  <span className="v2-problem-number">
                    {problem.number}
                  </span>

                  <span className="v2-problem-tag">
                    {problem.tag}
                  </span>
                </div>

                <div className="v2-problem-icon">
                  <span />
                  <span />
                  <span />
                </div>

                <h3>{problem.title}</h3>
                <p>{problem.description}</p>

                <div className="v2-problem-hover-line" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
