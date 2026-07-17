import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bella Vista Italian Kitchen | Houston, TX",
    template: "%s | Bella Vista Italian Kitchen",
  },
  description:
    "Experience authentic Italian cuisine, fresh ingredients and warm hospitality at Bella Vista Italian Kitchen in Houston, Texas.",
  keywords: [
    "Italian restaurant Houston",
    "Bella Vista Italian Kitchen",
    "Italian food Houston",
    "restaurant reservations Houston",
    "Italian delivery Houston",
  ],
  authors: [
    {
      name: "Bella Vista Italian Kitchen",
    },
  ],
  creator: "Bella Vista Italian Kitchen",
  publisher: "Bella Vista Italian Kitchen",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Bella Vista Italian Kitchen | Houston, TX",
    description:
      "Authentic Italian cuisine, fresh ingredients and memorable dining experiences in Houston.",
    type: "website",
    locale: "en_US",
    siteName: "Bella Vista Italian Kitchen",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bella Vista Italian Kitchen | Houston, TX",
    description:
      "Authentic Italian cuisine and warm hospitality in Houston, Texas.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfairDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
