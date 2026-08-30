import { FaFacebookF, FaInstagram } from "react-icons/fa";
import Container from "@/components/common/Container";

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--primary)] py-12 text-white">
      <Container>
        <div className="grid gap-10 border-b border-white/15 pb-10 md:grid-cols-3">
          <div>
            <a href="#home">
              <span className="block text-2xl font-bold">Bella Vista</span>

              <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                Italian Kitchen
              </span>
            </a>

            <p className="mt-5 max-w-sm leading-7 text-white/65">
              Authentic Italian cuisine, fresh ingredients and warm hospitality
              in the heart of Houston.
            </p>
          </div>

          <div>
            <h2 className="font-bold">Quick Links</h2>

            <nav className="mt-5 flex flex-col gap-3">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="w-fit text-sm text-white/65 hover:text-[var(--accent)]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="font-bold">Follow Us</h2>

            <div className="mt-5 flex gap-3">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <FaFacebookF size={18} />
              </a>
            </div>

            <p className="mt-5 text-sm leading-6 text-white/65">
              1800 Westheimer Road
              <br />
              Houston, TX 77098
            </p>
          </div>
        </div>

        <div className="pt-7 text-center text-sm text-white/55">
          <p>
            © {currentYear} Bella Vista Italian Kitchen. All rights reserved.
          </p>

          <p className="mt-2">
            Concept website created by{" "}
            <span className="font-medium text-white/75">Northova Digital</span>.
            Demo content only.
          </p>
        </div>
      </Container>
    </footer>
  );
}
