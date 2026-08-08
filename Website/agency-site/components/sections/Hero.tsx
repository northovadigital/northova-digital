import Link from "next/link";
import { HeroVisual } from "@/components/motion/HeroVisual";
import { Reveal } from "@/components/motion/Reveal";

export function Hero() {
  return (
    <section className="v2-hero">
      <div className="v2-hero-noise" />
      <div className="v2-hero-glow v2-hero-glow-one" />
      <div className="v2-hero-glow v2-hero-glow-two" />
      <div className="v2-hero-grid-pattern" />

      <div className="shell v2-hero-grid">
        <div className="v2-hero-copy">
          <Reveal>
            <div className="v2-hero-badge">
              <span className="v2-badge-dot" />
              USA-focused digital studio
              <span className="v2-badge-arrow">↗</span>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <h1>
              Build a digital presence
              <span>
                people trust.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={170}>
            <p className="v2-hero-description">
              Strategy-led websites for U.S. businesses
              that need to look credible, communicate
              clearly and turn more visitors into
              opportunities.
            </p>
          </Reveal>

          <Reveal delay={250}>
            <div className="v2-hero-actions">
              <Link
                className="v2-button v2-button-primary"
                href="#contact"
              >
                Get My Free Website Review
                <span>↗</span>
              </Link>

              <Link
                className="v2-button v2-button-secondary"
                href="#work"
              >
                See Our Work
                <span>↓</span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={330}>
            <div className="v2-hero-proof">
              <div className="v2-proof-avatars">
                <span>N</span>
                <span>UX</span>
                <span>SEO</span>
              </div>

              <div>
                <strong>
                  Strategy + design + development
                </strong>

                <p>
                  One focused process from idea to launch.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal
          className="v2-hero-visual-reveal"
          delay={220}
        >
          <HeroVisual />
        </Reveal>
      </div>

      <div className="v2-hero-trust">
        <div className="shell v2-trust-inner">
          <p>
            Built around what modern businesses actually
            need
          </p>

          <div className="v2-trust-items">
            <span>
              <i>01</i>
              Mobile-first
            </span>

            <span>
              <i>02</i>
              Conversion focused
            </span>

            <span>
              <i>03</i>
              Search ready
            </span>

            <span>
              <i>04</i>
              Built to scale
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
