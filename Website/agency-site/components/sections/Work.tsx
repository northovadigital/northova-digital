import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";

export function Work() {
  return (
    <section className="v2-work" id="work">
      <div className="shell">
        <div className="v2-work-grid">
          <Reveal>
            <div className="v2-work-visual">
              <div className="v2-work-visual-label">
                <span />
                Responsive concept
              </div>

              <div className="v2-work-desktop-shot">
                <Image
                  src="/work/bella-vista-desktop.png"
                  alt="Bella Vista Italian Kitchen desktop website concept"
                  width={1770}
                  height={864}
                  priority={false}
                />
              </div>

              <div className="v2-work-mobile-shot">
                <Image
                  src="/work/bella-vista-mobile.png"
                  alt="Bella Vista Italian Kitchen mobile website concept"
                  width={372}
                  height={744}
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={110}>
            <div className="v2-work-copy">
              <div className="v2-section-kicker v2-section-kicker-light">
                <span />
                Featured concept
              </div>

              <h2>
                Design quality demonstrated through a complete
                <span> restaurant concept.</span>
              </h2>

              <p>
                Bella Vista Italian Kitchen demonstrates how thoughtful
                branding, responsive design and clear customer journeys can
                create a stronger digital presence for a hospitality business.
              </p>

              <div className="v2-work-points">
                <div>
                  <span />
                  <p>Clear desktop and mobile experience</p>
                </div>

                <div>
                  <span />
                  <p>Hospitality-focused visual direction</p>
                </div>

                <div>
                  <span />
                  <p>Reservation and ordering calls to action</p>
                </div>

                <div>
                  <span />
                  <p>Search-ready and responsive foundations</p>
                </div>
              </div>

              <a
                className="v2-work-link"
                href="https://bella-vista-restaurant-demo.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                View Live Concept
                <span aria-hidden="true">↗</span>
              </a>

              <div className="v2-work-disclosure">
                <strong>
                  Concept project · Designed and developed by Northova Digital
                </strong>

                <p>
                  Demonstration work created to showcase our capabilities. It is
                  not presented as a client engagement.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
