import Link from "next/link";
import Container from "@/components/common/Container";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[var(--primary)] py-24 text-white md:py-32"
    >
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[var(--accent)]/20" />
      <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/5" />

      <Container className="relative">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Authentic Italian Dining in Houston
          </p>

          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            Traditional Italian flavors, made with passion.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
            Fresh ingredients, timeless recipes and a warm dining experience
            for families, friends and special occasions.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="#reservation"
              className="rounded-full bg-[var(--accent)] px-7 py-3.5 font-semibold text-[var(--primary-dark)] hover:opacity-90"
            >
              Reserve Table
            </Link>

            <Link
              href="#order"
              className="rounded-full border border-white/60 px-7 py-3.5 font-semibold text-white hover:bg-white hover:text-[var(--primary)]"
            >
              Order Online
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
