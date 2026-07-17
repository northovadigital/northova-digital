import Container from "@/components/common/Container";

const menuItems = [
  {
    name: "Margherita Pizza",
    description: "Tomato, fresh mozzarella, basil and extra virgin olive oil.",
    price: "$18",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Seafood Linguine",
    description: "Fresh seafood, garlic, tomato and handmade linguine pasta.",
    price: "$26",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Truffle Risotto",
    description: "Creamy arborio rice, mushrooms, parmesan and truffle oil.",
    price: "$24",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Chicken Parmigiana",
    description: "Breaded chicken, tomato sauce, mozzarella and parmesan.",
    price: "$23",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Burrata Salad",
    description: "Creamy burrata, tomatoes, fresh greens and balsamic glaze.",
    price: "$16",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Classic Tiramisu",
    description: "Espresso-soaked layers, mascarpone cream and cocoa.",
    price: "$12",
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80",
  },
];

export default function FeaturedMenu() {
  return (
    <section
      id="menu"
      className="scroll-mt-20 bg-[var(--cream)] py-20 md:py-28"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Our Menu
          </p>

          <h2 className="mt-4 text-4xl font-bold text-[var(--primary)] md:text-5xl">
            Guest favorites, prepared fresh every day.
          </h2>

          <p className="mt-5 leading-8 text-[var(--muted)]">
            Explore a selection of our most-loved Italian dishes made with
            fresh ingredients and traditional recipes.
          </p>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <article
              key={item.name}
              className="overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                role="img"
                aria-label={item.name}
                className="h-56 bg-cover bg-center"
                style={{ backgroundImage: `url("${item.image}")` }}
              />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-bold text-[var(--primary)]">
                    {item.name}
                  </h3>

                  <span className="shrink-0 text-lg font-bold text-[var(--accent)]">
                    {item.price}
                  </span>
                </div>

                <p className="mt-3 leading-7 text-[var(--muted)]">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#order"
            className="inline-flex rounded-full bg-[var(--primary)] px-7 py-3.5 font-semibold text-white hover:bg-[var(--primary-dark)]"
          >
            View Full Menu
          </a>
        </div>
      </Container>
    </section>
  );
}
