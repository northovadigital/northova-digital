"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`v2-header ${scrolled ? "v2-header-scrolled" : ""}`}>
      <div className="shell v2-header-inner">
        <Link className="v2-brand" href="/" aria-label="Northova Digital home">
          <span className="v2-brand-mark">
            <span>N</span>
          </span>

          <span className="v2-brand-copy">
            <strong>Northova</strong>
            <small>Digital</small>
          </span>
        </Link>

        <nav className="v2-desktop-nav" aria-label="Primary navigation">
          <Link href="#services">Services</Link>
          <Link href="#work">Our Work</Link>
          <Link href="#process">Process</Link>
        </nav>

        <div className="v2-header-actions">
          <Link className="v2-header-cta" href="#contact">
            Free Website Review
            <span>↗</span>
          </Link>

          <button
            className="v2-mobile-menu-button"
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        className={`v2-mobile-menu ${menuOpen ? "v2-mobile-menu-open" : ""}`}
      >
        <div className="shell v2-mobile-menu-inner">
          <Link href="#services" onClick={() => setMenuOpen(false)}>
            Services
          </Link>

          <Link href="#work" onClick={() => setMenuOpen(false)}>
            Our Work
          </Link>

          <Link href="#process" onClick={() => setMenuOpen(false)}>
            Process
          </Link>

          <Link
            className="v2-mobile-cta"
            href="#contact"
            onClick={() => setMenuOpen(false)}
          >
            Get a Free Website Review
            <span>↗</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
