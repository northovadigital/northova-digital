import Container from "@/components/common/Container";

export default function About() {
  return (
    <section id="about" className="bg-white py-20 md:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-[var(--primary)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)]" />

            <div className="absolute left-8 top-8 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[var(--primary-dark)]">
              Since 1998
            </div>

            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)]">
                Bella Vista
              </p>

              <h3 className="mt-3 text-3xl font-bold">
                Italian tradition in the heart of Houston.
              </h3>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
              Our Story
            </p>

            <h2 className="mt-4 text-4xl font-bold leading-tight text-[var(--primary)] md:text-5xl">
              Family recipes, fresh ingredients and genuine hospitality.
            </h2>

            <p className="mt-6 leading-8 text-[var(--muted)]">
              Bella Vista brings the warmth of Italian family dining to
              Houston. Every dish is prepared with carefully selected
              ingredients, traditional recipes and a passion for memorable
              meals.
            </p>

            <p className="mt-4 leading-8 text-[var(--muted)]">
              From relaxed family dinners to special celebrations, our goal is
              to make every guest feel at home.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div>
                <p className="text-3xl font-bold text-[var(--primary)]">25+</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Years serving
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-[var(--primary)]">40+</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Italian dishes
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-[var(--primary)]">4.9</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Guest rating
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
