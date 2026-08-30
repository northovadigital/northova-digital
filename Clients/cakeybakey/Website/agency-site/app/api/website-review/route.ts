import { NextResponse } from "next/server";

export const runtime = "nodejs";

type WebsiteReviewPayload = {
  name?: unknown;
  business?: unknown;
  website?: unknown;
  email?: unknown;
  challenge?: unknown;
  companyWebsite?: unknown;
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidWebsite(website: string) {
  if (!website) {
    return true;
  }

  try {
    const url = new URL(website);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL ||
      "Northova Website <onboarding@resend.dev>";

    if (!apiKey || !toEmail) {
      console.error("Website review email service is not configured.");

      return NextResponse.json(
        { message: "The enquiry service is temporarily unavailable." },
        { status: 500 },
      );
    }

    const payload = (await request.json()) as WebsiteReviewPayload;

    const name = cleanString(payload.name);
    const business = cleanString(payload.business);
    const website = cleanString(payload.website);
    const email = cleanString(payload.email).toLowerCase();
    const challenge = cleanString(payload.challenge);
    const companyWebsite = cleanString(payload.companyWebsite);

    // Honeypot field. Bots often fill hidden fields.
    if (companyWebsite) {
      return NextResponse.json({ success: true });
    }

    if (
      !name ||
      !business ||
      !email ||
      !challenge ||
      name.length > 100 ||
      business.length > 150 ||
      email.length > 254 ||
      website.length > 500 ||
      challenge.length > 3000
    ) {
      return NextResponse.json(
        { message: "Please check the information you entered." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!isValidWebsite(website)) {
      return NextResponse.json(
        {
          message:
            "Please enter the website URL including http:// or https://.",
        },
        { status: 400 },
      );
    }

    const subject = `Website Review Request - ${business}`;

    const text = [
      "New Northova Digital website review request",
      "",
      `Name: ${name}`,
      `Business: ${business}`,
      `Website: ${website || "Not provided"}`,
      `Email: ${email}`,
      "",
      "What they would like to improve:",
      challenge,
    ].join("\n");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject,
        text,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.text();

      console.error("Resend email request failed:", response.status, error);

      return NextResponse.json(
        {
          message:
            "We could not submit your request right now. Please try again.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Website review submission failed:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while submitting your request.",
      },
      { status: 500 },
    );
  }
}
