import Container from "@/components/common/Container";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    alt: "Elegant Italian restaurant dining area",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80",
    alt: "Restaurant table setting",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    alt: "Modern restaurant interior",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=80",
    alt: "Warm restaurant atmosphere",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
    alt: "Fresh Italian cuisine",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    alt: "Bella Vista restaurant seating",
    className: "",
  },
];

export default function Gallery() {
  return (
    <section
      id="gallery"
      className="scroll-mt-20 bg-white py-20 md:py-28"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Our Gallery
          </p>

          <h2 className="mt-4 text-4xl font-bold text-[var(--primary)] md:text-5xl">
            Experience the warmth of Bella Vista.
          </h2>

          <p className="mt-5 leading-8 text-[var(--muted)]">
            A glimpse into our food, atmosphere and memorable dining
            experiences.
          </p>
        </div>

        <div className="mt-12 grid auto-rows-[220px] gap-5 md:grid-cols-3 md:auto-rows-[250px]">
          {galleryImages.map((image) => (
            <div
              key={image.src}
              role="img"
              aria-label={image.alt}
              className={`group relative overflow-hidden rounded-3xl ${image.className}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url("${image.src}")` }}
              />

              <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
