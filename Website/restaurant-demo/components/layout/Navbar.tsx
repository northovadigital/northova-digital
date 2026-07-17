"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Container from "@/components/common/Container";

const navigationLinks = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[var(--cream)]">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link href="#home">
            <span className="block text-2xl font-bold text-[var(--primary)]">
              Bella Vista
            </span>

            <span className="block text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
              Italian Kitchen
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navigationLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium hover:text-[var(--accent)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="#order"
              className="rounded-full border border-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary)]"
            >
              Order Online
            </Link>

            <Link
              href="#reservation"
              className="rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Reserve Table
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-[var(--primary)] lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="flex flex-col gap-4 border-t border-black/10 py-5 lg:hidden">
            {navigationLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="#order"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-full border border-[var(--primary)] px-5 py-3 text-center text-sm font-semibold text-[var(--primary)]"
            >
              Order Online
            </Link>

            <Link
              href="#reservation"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-full bg-[var(--primary)] px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Reserve Table
            </Link>
          </nav>
        )}
      </Container>
    </header>
  );
}
