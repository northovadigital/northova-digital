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
                <span>N</span>
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
