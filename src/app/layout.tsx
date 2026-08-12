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
  title: {
    default: storeConfig.name,
    template: `%s | ${storeConfig.name}`,
  },
  description: storeConfig.description,
  applicationName: storeConfig.name,
  category: "shopping",
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
