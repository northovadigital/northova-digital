import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

const insights = [
  {
    category: "Restaurant Growth",
    readingTime: "6 min read",
    title: "What makes a restaurant website turn visitors into customers?",
    description:
      "Menus, mobile usability, ordering journeys and trust signals can directly shape how easily customers choose to act.",
  },
  {
    category: "Website Strategy",
    readingTime: "5 min read",
    title: "Seven signs your business website may be costing you opportunities",
    description:
      "A practical look at the credibility, usability and conversion problems that quietly push good prospects away.",
  },
  {
    category: "Digital Presence",
    readingTime: "7 min read",
    title:
      "What should businesses evaluate before planning a website redesign?",
    description:
      "A structured checklist for reviewing positioning, content, user journeys, technology and business goals before rebuilding.",
  },
];

export function Insights() {
  return (
    <section className="v3-insights" id="insights">
      <div className="shell">
        <Reveal>
          <div className="v2-section-kicker">
            <span />
            Insights
          </div>
        </Reveal>

        <div className="v3-insights-heading">
          <Reveal>
            <h2>
              Useful ideas for businesses that want to
              <span> grow smarter online.</span>
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <div>
              <p>
                Practical thinking around websites, customer experience,
                restaurant growth and digital strategy — written for business
                owners, not just developers.
              </p>

              <Link href="#contact">
                Get practical guidance for your business
                <span>
                  <ArrowUpRight className="v2-arrow-icon" />
                </span>
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="v3-insights-grid">
          {insights.map((insight, index) => (
            <Reveal key={insight.title} delay={index * 80}>
              <article className="v3-insight-card">
                <div className="v3-insight-index">
                  <span>0{index + 1}</span>
                  <span>{insight.category}</span>
                </div>

                <div className="v3-insight-visual">
                  <span className="v3-insight-shape v3-insight-shape-one" />
                  <span className="v3-insight-shape v3-insight-shape-two" />

                  <strong>
                    Northova
                    <br />
                    Insights
                  </strong>
                </div>

                <div className="v3-insight-content">
                  <span>{insight.readingTime}</span>
                  <h3>{insight.title}</h3>
                  <p>{insight.description}</p>

                  <div className="v3-insight-footer">
                    <span>Article publishing soon</span>
                    <span>
                      <ArrowUpRight className="v2-arrow-icon" />
                    </span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
