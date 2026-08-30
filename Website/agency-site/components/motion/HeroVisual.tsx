import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
export function HeroVisual() {
  return (
    <div className="v2-hero-visual" aria-hidden="true">
      <div className="v2-orbit v2-orbit-one" />
      <div className="v2-orbit v2-orbit-two" />

      <div className="v2-browser">
        <div className="v2-browser-top">
          <div className="v2-browser-dots">
            <span />
            <span />
            <span />
          </div>

          <div className="v2-browser-address">northovadigital.com</div>
        </div>

        <div className="v2-browser-page">
          <div className="v2-browser-nav">
            <div className="v2-mini-logo">
<img
          src="/northova-logo.png"
          alt=""
          className="v2-actual-logo"
          aria-hidden="true"
        />
</div>

            <div className="v2-mini-nav">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="v2-browser-content">
            <p>BUILT FOR BUSINESS GROWTH</p>

            <h3>
              Your digital presence should work
              <em> harder.</em>
            </h3>

            <div className="v2-browser-buttons">
              <span />
              <span />
            </div>
          </div>

          <div className="v2-browser-metrics">
            <div>
              <span>Strategy</span>
              <strong>Clear</strong>
            </div>

            <div>
              <span>Experience</span>
              <strong>Focused</strong>
            </div>

            <div>
              <span>Growth</span>
              <strong>Ready</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="v2-phone">
        <div className="v2-phone-notch" />

        <div className="v2-phone-content">
          <span className="v2-phone-brand">Bella Vista</span>

          <strong>
            Dining made
            <br />
            memorable.
          </strong>

          <div className="v2-phone-button">Explore menu</div>
        </div>
      </div>

      <div className="v2-floating-card v2-floating-card-performance">
        <span className="v2-card-icon">
          <ArrowUpRight className="v2-arrow-icon" />
        </span>

        <div>
          <small>Experience</small>
          <strong>Conversion focused</strong>
        </div>
      </div>

      <div className="v2-floating-card v2-floating-card-seo">
        <span className="v2-status-pulse" />

        <div>
          <small>Foundation</small>
          <strong>Search ready</strong>
        </div>
      </div>

      <div className="v2-floating-pill">
        <span>✦</span>
        Strategy-led development
      </div>
    </div>
  );
}
