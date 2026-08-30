import Container from "@/components/common/Container";

const testimonials = [
  {
    name: "Emily Carter",
    location: "Houston, TX",
    review:
      "The food was outstanding and the atmosphere felt warm and welcoming. The seafood linguine was easily one of the best dishes I have had in Houston.",
  },
  {
    name: "Michael Rodriguez",
    location: "Houston, TX",
    review:
      "Bella Vista is now our favorite place for family dinners. Excellent service, fresh ingredients and a beautiful dining experience.",
  },
  {
    name: "Sophia Williams",
    location: "Sugar Land, TX",
    review:
      "We celebrated our anniversary here and everything was perfect. The staff made the evening feel special from beginning to end.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[var(--cream)] py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Guest Reviews
          </p>

          <h2 className="mt-4 text-4xl font-bold text-[var(--primary)] md:text-5xl">
            Loved by our guests.
          </h2>

          <p className="mt-5 leading-8 text-[var(--muted)]">
            Discover why local diners continue choosing Bella Vista for
            memorable meals and special occasions.
          </p>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-3xl bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className="text-xl tracking-wider text-[var(--accent)]"
                aria-label="5 out of 5 stars"
              >
                ★★★★★
              </div>

              <blockquote className="mt-5 leading-8 text-[var(--muted)]">
                “{testimonial.review}”
              </blockquote>

              <div className="mt-7 border-t border-black/10 pt-5">
                <p className="font-bold text-[var(--primary)]">
                  {testimonial.name}
                </p>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  {testimonial.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
