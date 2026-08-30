import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="v3-footer">
      <div className="shell">
        <div className="v3-footer-top">
          <div className="v3-footer-brand-column">
            <Link
              className="v2-brand"
              href="/"
              aria-label="Northova Digital home"
            >
              <span className="v2-brand-mark">
<<<<<<< HEAD
                <span>N</span>
=======
                <img
                  src="/northova-logo.png"
                  alt=""
                  className="v2-brand-logo"
                  aria-hidden="true"
                />
>>>>>>> 5455781af8973d5af7f3babcd118fd551cdde8e2
              </span>

              <span className="v2-brand-copy">
                <strong>Northova</strong>
                <small>Digital</small>
              </span>
            </Link>

            <p>
              Strategy-led websites and digital experiences for businesses that
              want to communicate clearly, look credible and grow with
              confidence.
            </p>

            <span className="v3-footer-location">
              Remote-first · Serving U.S. businesses
            </span>
          </div>

          <div className="v3-footer-column">
            <strong>Explore</strong>
            <Link href="/#services">Services</Link>
            <Link href="/#work">Our Work</Link>
            <Link href="/#process">Process</Link>
          </div>

          <div className="v3-footer-column">
            <strong>Services</strong>
            <span>Web Design</span>
            <span>Website Redesign</span>
            <span>Restaurant Websites</span>
            <span>SEO-Ready Websites</span>
          </div>

          <div className="v3-footer-column">
            <strong>Contact</strong>

            <a href="mailto:northovadigital@gmail.com">
              northovadigital@gmail.com
            </a>

            <Link href="/#contact">Free Website Review</Link>

            <span>Available for U.S. projects</span>
<<<<<<< HEAD
=======

            <div className="v3-footer-socials">
              <a
                className="v3-footer-social"
                href="https://www.instagram.com/northovadigital/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Northova Digital on Instagram"
              >
                <span className="v3-social-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3.5"
                      y="3.5"
                      width="17"
                      height="17"
                      rx="5"
                    />
                    <circle cx="12" cy="12" r="4" />
                    <circle
                      cx="17.4"
                      cy="6.7"
                      r="1"
                      className="v3-instagram-dot"
                    />
                  </svg>
                </span>
              </a>

              <span
                className="v3-footer-social v3-footer-social-disabled"
                aria-label="Northova Digital on X — coming soon"
                title="X account coming soon"
              >
                <span className="v3-social-icon v3-x-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 4h3.9l4.1 5.5L17.4 4H19l-5.2 6.7L19.5 20h-3.9l-4.4-5.9L6.6 20H5l5.4-7L5 4Z" />
                  </svg>
                </span>
              </span>
            </div>
>>>>>>> 5455781af8973d5af7f3babcd118fd551cdde8e2
          </div>
        </div>

        <div className="v3-footer-bottom">
          <span>© {new Date().getFullYear()} Northova Digital.</span>

          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>

          <span>Strategy · Design · Technology</span>
        </div>
      </div>
    </footer>
  );
}
