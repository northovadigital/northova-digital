import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
<<<<<<< HEAD
import Image from "next/image";
=======
>>>>>>> 5455781af8973d5af7f3babcd118fd551cdde8e2
import { Reveal } from "@/components/motion/Reveal";

export function Work() {
  return (
    <section className="v2-work" id="work">
      <div className="shell">
<<<<<<< HEAD
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

=======

        <Reveal>
          <div className="v2-work-heading">
            <div>
              <span className="v2-section-eyebrow">Selected work</span>

              <h2>
                Work built for
                <span> real businesses.</span>
              </h2>
            </div>

            <p>
              A selection of digital experiences showing how Northova approaches
              real production work alongside carefully developed concepts.
            </p>
          </div>
        </Reveal>

        {/* --------------------------------------------------
            PROJECT 01 — FARHANA & KULSOOM
            Real production project
        -------------------------------------------------- */}

        <Reveal delay={100}>
          <article className="v2-project v2-project-primary">

            <div className="v2-project-visual v2-project-live">
              <div className="v2-project-browser">

                <div className="v2-project-browser-bar">

                  <div className="v2-project-browser-dots">
                    <i />
                    <i />
                    <i />
                  </div>

                  <div className="v2-project-browser-url">
                    bouboutique-store.fk-boutique.workers.dev
                  </div>

                  <span className="v2-project-live-status">
                    LIVE
                  </span>

                </div>

                <div className="v2-fk-showcase">

                  <div className="v2-fk-showcase-main">
                    <img
                      src="/work/f&k-display-1200.webp"
                      alt="Farhana and Kulsoom Boutique production website"
                        />
                  </div>

                  <div className="v2-fk-showcase-secondary">

                    <div className="v2-fk-showcase-card">
                      <img
                        src="/work/f&k-display-2-1200.webp"
                        alt="Farhana and Kulsoom Boutique website"
                          />
                    </div>

                    <div className="v2-fk-showcase-card">
                      <img
                        src="/work/f&k-display-3-1200.webp"
                        alt="Farhana and Kulsoom Boutique website"
                          />
                    </div>

                  </div>

                </div>

              </div>

              <div className="v2-project-live-badge">
                <span />
                Real production project
              </div>
            </div>

            <div className="v2-project-copy">

              <div className="v2-project-meta">
                <span>01</span>
                <span>Production · E-commerce · Admin</span>
              </div>

              <h3>
                Farhana &amp; Kulsoom
                <span> Boutique</span>
              </h3>

              <p>
                A live production website built for a fashion business, with a
                responsive customer experience and supporting admin functionality
                for day-to-day business operations.
              </p>

              <ul className="v2-project-points">
                <li>Production-ready customer storefront</li>
                <li>Responsive shopping experience</li>
                <li>Business administration system</li>
              </ul>

              <a
                className="v2-work-link"
                href="https://boutique-store.fk-boutique.workers.dev"
                target="_blank"
                rel="noreferrer"
              >
                Visit Live Website
                <ArrowUpRight className="v2-arrow-icon" />
              </a>

            </div>
          </article>
        </Reveal>

        {/* --------------------------------------------------
            PROJECT 02 — BELLA VISTA
            Prototype / concept project
        -------------------------------------------------- */}

        <Reveal delay={160}>
          <article className="v2-project v2-project-secondary">

            <div className="v2-project-visual v2-project-bella">

              <div className="v2-work-visual-label">
                <span />
                Prototype concept
              </div>

              <div className="v2-bella-browser">

                <div className="v2-bella-browser-bar">

                  <div className="v2-bella-browser-dots">
                    <i />
                    <i />
                    <i />
                  </div>

                  <div className="v2-bella-browser-url">
                    bella-vista-restaurant-demo.vercel.app
                  </div>

                  <span className="v2-bella-browser-status">
                    CONCEPT
                  </span>

                </div>

                <div className="v2-bella-browser-screen">

                  <div className="v2-bella-page">
                    <img
                          src="/work/Bella-Vista-Display-1200.webp"
                          srcSet={
                            `                          /work/Bella-Vista-Display-480.webp 480w,
                          /work/Bella-Vista-Display-768.webp 768w,
                          /work/Bella-Vista-Display-1200.webp 1200w,
                          /work/Bella-Vista-Display-1600.webp 1600w`
                          }
                          sizes="(max-width: 590px) 92vw, (max-width: 1000px) 70vw, 800px"
                          alt="Bella Vista restaurant website full page concept"
                          loading="lazy"
                          decoding="async"
                        />
                  </div>

                </div>

              </div>

            </div>

            <div className="v2-project-copy">

              <div className="v2-project-meta">
                <span>02</span>
                <span>Prototype · Restaurant · UX</span>
              </div>

              <h3>
                Bella
                <span> Vista</span>
              </h3>

              <p>
                A restaurant website concept exploring a stronger digital
                presence, clearer customer journeys and a more premium mobile
                experience.
              </p>

              <ul className="v2-project-points">
                <li>Restaurant-focused customer journey</li>
                <li>Responsive desktop and mobile experience</li>
                <li>Conversion-oriented information structure</li>
              </ul>

>>>>>>> 5455781af8973d5af7f3babcd118fd551cdde8e2
              <a
                className="v2-work-link"
                href="https://bella-vista-restaurant-demo.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
<<<<<<< HEAD
                View Live Concept
                <span aria-hidden="true">
                  <ArrowUpRight className="v2-arrow-icon" />
                </span>
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
=======
                View Prototype
                <ArrowUpRight className="v2-arrow-icon" />
              </a>

              <div className="v2-project-disclosure">
                <strong>PROJECT STATUS</strong>
                <p>
                  Concept website created by Northova Digital. Demo content
                  only.
                </p>
              </div>

            </div>
          </article>
        </Reveal>

>>>>>>> 5455781af8973d5af7f3babcd118fd551cdde8e2
      </div>
    </section>
  );
}
