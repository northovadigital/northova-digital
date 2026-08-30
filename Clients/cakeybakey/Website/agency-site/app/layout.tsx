import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./marketing-v2.css";
import { siteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Northova Digital | Web Systems for Serious Business",
    template: "%s | Northova Digital",
  },
  description:
    "Northova Digital designs and develops high-trust corporate, restaurant and local-business websites for companies serving the United States.",
  keywords: [
    "corporate website design",
    "website redesign company",
    "restaurant website design",
    "local business web development",
    "conversion focused website",
    "Northova Digital",
  ],
  applicationName: "Northova Digital",
  authors: [{ name: "Northova Digital" }],
  creator: "Northova Digital",
  publisher: "Northova Digital",
  category: "technology",
<<<<<<< HEAD
=======
  icons: {
    icon: "/northova-logo.png",
    shortcut: "/northova-logo.png",
    apple: "/northova-logo.png",
  },
>>>>>>> 5455781af8973d5af7f3babcd118fd551cdde8e2
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
  twitter: {
    card: "summary_large_image",
    title: "Northova Digital | Web Systems for Serious Business",
    description:
      "Strategy, experience design and engineering for companies that need a stronger digital presence.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
