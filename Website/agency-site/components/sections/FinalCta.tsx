"use client";

import { FormEvent, useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function FinalCta() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState(
    "We only use this information to respond to your enquiry.",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "submitting") {
      return;
    }

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const payload = {
      name: String(form.get("name") || "").trim(),
      business: String(form.get("business") || "").trim(),
      website: String(form.get("website") || "").trim(),
      email: String(form.get("email") || "").trim(),
      challenge: String(form.get("challenge") || "").trim(),
      companyWebsite: String(form.get("companyWebsite") || "").trim(),
    };

    setStatus("submitting");
    setMessage("Submitting your request...");

    try {
      const response = await fetch("/api/website-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "We could not submit your request. Please try again.",
        );
      }

      setStatus("success");
      setMessage(
        "Request received. We will review your website and get back to you.",
      );

      formElement.reset();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "We could not submit your request. Please try again.";

      setStatus("error");
      setMessage(errorMessage);
    }
  }

  return (
    <section className="v3-lead-section" id="contact">
      <div className="v3-lead-glow v3-lead-glow-one" />
      <div className="v3-lead-glow v3-lead-glow-two" />

      <div className="shell v3-lead-grid">
        <div className="v3-lead-copy">
          <div className="v3-lead-kicker">
            <span />
            Free website review
          </div>

          <h2>
            Find out what may be holding your
            <span> website back.</span>
          </h2>

          <p>
            Share your current website and the business challenge you are trying
            to solve. We will start by identifying the areas that deserve the
            most attention.
          </p>

          <div className="v3-review-points">
            <div>
              <span>01</span>
              <p>Website credibility and positioning</p>
            </div>

            <div>
              <span>02</span>
              <p>Mobile experience and customer journeys</p>
            </div>

            <div>
              <span>03</span>
              <p>Conversion and growth opportunities</p>
            </div>
          </div>

          <small>No obligation. No generic automated report.</small>
        </div>

        <form className="v3-lead-form" onSubmit={handleSubmit}>
          <div className="v3-form-heading">
            <div>
              <span className="v3-form-status" />
              Complimentary review
            </div>

            <span>Northova Digital</span>
          </div>

          <div className="v3-form-row">
            <label>
              Your name
              <input
                name="name"
                type="text"
                placeholder="John Smith"
                autoComplete="name"
                maxLength={100}
                required
              />
            </label>

            <label>
              Business name
              <input
                name="business"
                type="text"
                placeholder="Your business"
                autoComplete="organization"
                maxLength={150}
                required
              />
            </label>
          </div>

          <label>
            Current website
            <input
              name="website"
              type="url"
              placeholder="https://yourwebsite.com"
              autoComplete="url"
              maxLength={500}
            />
          </label>

          <label>
            Email address
            <input
              name="email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              maxLength={254}
              required
            />
          </label>

          <label>
            What would you like to improve?
            <textarea
              name="challenge"
              rows={4}
              placeholder="Tell us briefly what is not working or what you want the website to achieve."
              maxLength={3000}
              required
            />
          </label>

          <div className="v3-form-honeypot" aria-hidden="true">
            <label>
              Company website confirmation
              <input
                name="companyWebsite"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>

          <button type="submit" disabled={status === "submitting"}>
            {status === "submitting"
              ? "Submitting..."
              : status === "success"
                ? "Request Received"
                : "Request My Free Website Review"}
            <span>{status === "success" ? "✓" : "↗"}</span>
          </button>

          <p
            className={`v3-form-note ${
              status === "success"
                ? "is-success"
                : status === "error"
                  ? "is-error"
                  : ""
            }`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        </form>
      </div>
    </section>
  );
}
