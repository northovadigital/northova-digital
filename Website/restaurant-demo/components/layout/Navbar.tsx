"use client";

import { useState } from "react";
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

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[var(--cream)]">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <a href="#home" onClick={closeMenu}>
            <span className="block text-2xl font-bold text-[var(--primary)]">
              Bella Vista
            </span>

            <span className="block text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
              Italian Kitchen
            </span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {navigationLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium hover:text-[var(--accent)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="#order"
              className="rounded-full border border-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
            >
              Order Online
            </a>

            <a
              href="#reservation"
              className="rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"
            >
              Reserve Table
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="rounded-lg p-2 text-[var(--primary)] lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav
            id="mobile-navigation"
            className="flex flex-col gap-4 border-t border-black/10 py-5 lg:hidden"
          >
            {navigationLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="text-sm font-medium hover:text-[var(--accent)]"
              >
                {link.label}
              </a>
            ))}

            <a
              href="#order"
              onClick={closeMenu}
              className="mt-2 rounded-full border border-[var(--primary)] px-5 py-3 text-center text-sm font-semibold text-[var(--primary)]"
            >
              Order Online
            </a>

            <a
              href="#reservation"
              onClick={closeMenu}
              className="rounded-full bg-[var(--primary)] px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Reserve Table
            </a>
          </nav>
        )}
      </Container>
    </header>
  );
}
