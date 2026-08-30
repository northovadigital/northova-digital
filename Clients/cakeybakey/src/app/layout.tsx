import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { storeConfig } from "@/config/store";
import { CartProvider } from "@/context/CartContext";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://boutique-store.fk-boutique.workers.dev",
  ),

  title: {
    default: "Farhana & Kulsoom | F&K Boutique Karachi",
    template: "%s | Farhana & Kulsoom",
  },

  description:
    "Farhana & Kulsoom (F&K Boutique) — a Karachi, Pakistan boutique for women's fashion, fragrances and home essentials.",

  keywords: [
    "Farhana & Kulsoom",
    "Farhana and Kulsoom",
    "F&K Boutique",
    "F&K boutique Karachi",
    "Farhana Kulsoom boutique",
    "boutique Karachi",
    "women's fashion Karachi",
    "Pakistani boutique",
    "fragrances Karachi",
    "home essentials Karachi",
  ],

  applicationName: "Farhana & Kulsoom",
  category: "shopping",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Farhana & Kulsoom | F&K Boutique Karachi",
    description:
      "Women's fashion, fragrances and home essentials curated in Karachi, Pakistan.",
    locale: "en_PK",
    type: "website",
    siteName: "Farhana & Kulsoom",
  },

  twitter: {
    card: "summary_large_image",
    title: "Farhana & Kulsoom | F&K Boutique Karachi",
    description:
      "Women's fashion, fragrances and home essentials curated in Karachi, Pakistan.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-PK"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
