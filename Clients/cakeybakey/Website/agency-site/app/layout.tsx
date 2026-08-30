import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northova Digital | Web Systems for Serious Business",
  description:
    "Strategy, experience design and engineering for companies that need a stronger digital presence.",
  icons: {
    icon: "/northova-logo.png",
    shortcut: "/northova-logo.png",
    apple: "/northova-logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Northova Digital | Web Systems for Serious Business",
    description:
      "Strategy, experience design and engineering for companies that need a stronger digital presence.",
    type: "website",
    locale: "en_US",
    siteName: "Northova Digital",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
