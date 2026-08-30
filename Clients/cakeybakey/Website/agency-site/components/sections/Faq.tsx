import { Reveal } from "@/components/motion/Reveal";

const questions = [
  {
    question: "What types of businesses does Northova work with?",
    answer:
      "Our current focus is professional websites for restaurants, hospitality businesses, local service companies and growing businesses across the United States. Our wider capabilities will expand as Northova grows.",
  },
  {
    question: "Can you redesign an existing website?",
    answer:
      "Yes. We can review the current website, identify the most important usability, credibility and conversion issues, and determine whether a focused redesign or a complete rebuild makes more sense.",
  },
  {
    question: "Do you only build restaurant websites?",
    answer:
      "No. Restaurants and hospitality are an important current specialization, but Northova also works with other businesses that need a stronger and more effective digital presence.",
  },
  {
    question: "Will the website work properly on mobile devices?",
    answer:
      "Yes. Responsive behavior is part of the development process from the beginning. Navigation, content hierarchy, forms and customer journeys are reviewed across common screen sizes.",
  },
  {
    question: "Can the website support SEO and future content?",
    answer:
      "Yes. We build search-ready technical foundations and can structure the website so service pages, industry pages and useful insight content can be added over time.",
  },
  {
    question: "How does the free website review work?",
    answer:
      "You share your current website and the main business challenge. We review the experience and identify the areas that deserve the most attention before recommending a project direction.",
  },
];

export function Faq() {
  return (
    <section className="v3-faq">
      <div className="shell v3-faq-layout">
        <Reveal>
          <div className="v3-faq-heading">
            <div className="v2-section-kicker">
              <span />
              Common questions
            </div>

            <h2>
              A few things you may want to know
              <span> before we talk.</span>
            </h2>

            <p>
              Clear expectations make projects easier. These are some of the
              questions business owners commonly ask before starting.
            </p>
          </div>
        </Reveal>

        <div className="v3-faq-list">
          {questions.map((item, index) => (
            <Reveal key={item.question} delay={index * 45}>
              <details className="v3-faq-item">
                <summary>
                  <span>0{index + 1}</span>

                  <strong>{item.question}</strong>

                  <i aria-hidden="true">+</i>
                </summary>

                <p>{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
