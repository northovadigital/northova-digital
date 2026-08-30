import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Use | Northova Digital",
  description:
    "Terms governing the use of the Northova Digital website and its content.",
};

export default function TermsPage() {
  return (
    <>
      <header className="legal-header">
        <div className="shell legal-header-inner">
          <Link
            className="v2-brand"
            href="/"
            aria-label="Northova Digital home"
          >
            <span className="v2-brand-mark">
<<<<<<< HEAD
              <span>N</span>
            </span>
=======
<img
              src="/northova-logo.png"
              alt=""
              className="v2-actual-logo"
              aria-hidden="true"
            />
          </span>
>>>>>>> 5455781af8973d5af7f3babcd118fd551cdde8e2

            <span className="v2-brand-copy">
              <strong>Northova</strong>
              <small>Digital</small>
            </span>
          </Link>

          <Link className="legal-home-link" href="/">
            Back to home
            <span>
              <ArrowUpRight className="v2-arrow-icon" />
            </span>
          </Link>
        </div>
      </header>

      <main className="legal-page">
        <div className="shell legal-layout">
          <aside className="legal-sidebar">
            <span>Legal</span>
            <strong>Terms of Use</strong>
            <small>Last updated August 8, 2026</small>
          </aside>

          <article className="legal-content">
            <div className="legal-intro">
              <span>Terms of Use</span>

              <h1>
                Simple terms for using the
                <em> Northova Digital website.</em>
              </h1>

              <p>
                These terms apply to your use of this website and the
                information, demonstrations and materials published on it.
              </p>
            </div>

            <section>
              <h2>1. Website purpose</h2>

              <p>
                This website presents information about Northova Digital, its
                capabilities, services, approach and selected demonstration
                work.
              </p>

              <p>
                Website content is provided for general informational and
                business communication purposes.
              </p>
            </section>

            <section>
              <h2>2. Website review requests and enquiries</h2>

              <p>
                Submitting a website review request or other enquiry does not
                create a client relationship, contract or obligation for either
                party.
              </p>

              <p>
                Any paid project will be subject to separately agreed scope,
                pricing, responsibilities and commercial terms.
              </p>
            </section>

            <section>
              <h2>3. Demonstration and concept work</h2>

              <p>
                Some work shown on this website may be identified as a concept,
                demonstration or portfolio project created to demonstrate
                Northova Digital&apos;s design and development capabilities.
              </p>

              <p>
                Concept work is not represented as a completed engagement for an
                actual client unless explicitly stated otherwise.
              </p>
            </section>

            <section>
              <h2>4. No guaranteed business results</h2>

              <p>
                Websites, design, development, search foundations and conversion
                improvements can support business goals, but Northova Digital
                does not guarantee specific revenue, traffic, rankings, leads or
                other commercial outcomes from information presented on this
                website.
              </p>
            </section>

            <section>
              <h2>5. Intellectual property</h2>

              <p>
                Unless otherwise indicated, the Northova Digital brand, website
                design, written content and original demonstration materials on
                this website belong to Northova Digital or are used with
                appropriate permission.
              </p>

              <p>
                You may view and share links to the website for ordinary
                personal or business reference. You may not reproduce or
                commercially reuse substantial original materials without
                permission.
              </p>
            </section>

            <section>
              <h2>6. Acceptable use</h2>

              <p>
                You must not intentionally misuse the website, interfere with
                its operation, attempt unauthorized access, submit malicious
                content or use automated systems in a manner intended to abuse
                the website or its enquiry forms.
              </p>
            </section>

            <section>
              <h2>7. External links</h2>

              <p>
                Links to external websites are provided for convenience or
                reference. Northova Digital does not control and is not
                responsible for the availability, security or content of
                third-party websites.
              </p>
            </section>

            <section>
              <h2>8. Website availability and accuracy</h2>

              <p>
                We aim to keep website information useful and accurate, but
                content may change and the website may occasionally be
                unavailable, incomplete or contain errors.
              </p>
            </section>

            <section>
              <h2>9. Changes to these terms</h2>

              <p>
                These terms may be updated as the website and Northova
                Digital&apos;s services develop. The current version will be
                published on this page.
              </p>
            </section>

            <section>
              <h2>10. Contact</h2>

              <p>
                Questions about these terms can be sent to{" "}
                <a href="mailto:northovadigital@gmail.com">
                  northovadigital@gmail.com
                </a>
                .
              </p>
            </section>
          </article>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
