import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy | Northova Digital",
  description:
    "Learn how Northova Digital handles information submitted through our website.",
};

export default function PrivacyPage() {
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
              <span>N</span>
            </span>

            <span className="v2-brand-copy">
              <strong>Northova</strong>
              <small>Digital</small>
            </span>
          </Link>

          <Link className="legal-home-link" href="/">
            Back to home
            <span>↗</span>
          </Link>
        </div>
      </header>

      <main className="legal-page">
        <div className="shell legal-layout">
          <aside className="legal-sidebar">
            <span>Legal</span>
            <strong>Privacy Policy</strong>
            <small>Last updated August 8, 2026</small>
          </aside>

          <article className="legal-content">
            <div className="legal-intro">
              <span>Privacy Policy</span>

              <h1>
                Clear information about how we handle
                <em> your details.</em>
              </h1>

              <p>
                This Privacy Policy explains how Northova Digital collects, uses
                and handles information submitted through this website.
              </p>
            </div>

            <section>
              <h2>1. Information we collect</h2>

              <p>
                When you request a free website review or contact Northova
                Digital through this website, we may collect information you
                choose to provide, including:
              </p>

              <ul>
                <li>Your name</li>
                <li>Your business name</li>
                <li>Your current website URL</li>
                <li>Your email address</li>
                <li>
                  Information about the website, project or business challenge
                  you would like to discuss
                </li>
              </ul>
            </section>

            <section>
              <h2>2. How we use your information</h2>

              <p>We use submitted information primarily to:</p>

              <ul>
                <li>Review and respond to your enquiry</li>
                <li>Prepare or discuss your requested website review</li>
                <li>Communicate with you about a potential project</li>
                <li>Protect the website and enquiry process from misuse</li>
                <li>
                  Maintain reasonable business records related to enquiries and
                  client communication
                </li>
              </ul>

              <p>
                Information submitted through the website review form is not
                intended to be sold or used for unrelated advertising.
              </p>
            </section>

            <section>
              <h2>3. Email delivery and service providers</h2>

              <p>
                Website enquiry notifications are currently delivered through
                Resend, an email delivery provider, and received in Northova
                Digital&apos;s business email inbox.
              </p>

              <p>
                Service providers may process information as necessary to
                provide their technical services and are subject to their own
                privacy and security practices.
              </p>
            </section>

            <section>
              <h2>4. Data retention</h2>

              <p>
                We retain enquiry information for as long as reasonably
                necessary to respond to requests, maintain relevant business
                records and support ongoing or potential business relationships.
              </p>

              <p>
                Information that is no longer reasonably required may be deleted
                as part of normal business administration.
              </p>
            </section>

            <section>
              <h2>5. Data security</h2>

              <p>
                We take reasonable steps to protect information submitted
                through this website. However, no website, email system or
                method of electronic transmission can be guaranteed to be
                completely secure.
              </p>
            </section>

            <section>
              <h2>6. Your requests</h2>

              <p>
                You may contact Northova Digital to ask about personal
                information you previously submitted, or to request correction
                or deletion where reasonably applicable.
              </p>
            </section>

            <section>
              <h2>7. External websites</h2>

              <p>
                This website may contain links to third-party websites or
                services. Northova Digital is not responsible for the privacy
                practices or content of websites operated by other parties.
              </p>
            </section>

            <section>
              <h2>8. Changes to this policy</h2>

              <p>
                We may update this Privacy Policy when our website, services or
                information practices change. The latest version will be
                published on this page with an updated date.
              </p>
            </section>

            <section>
              <h2>9. Contact</h2>

              <p>
                Questions about this Privacy Policy can be sent to{" "}
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
