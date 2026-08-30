const items = [
  {
    number: "01",
    title: "Cash on delivery",
    description: "Pay when your order reaches you.",
  },
  {
    number: "02",
    title: "Direct confirmation",
    description: "We personally confirm every order before delivery.",
  },
  {
    number: "03",
    title: "Curated selection",
    description: "A focused edit across fashion, fragrance and home.",
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-[#ded7cd] bg-[#eee9e1]">
      <div className="mx-auto grid max-w-7xl divide-y divide-[#d5cdc1] px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-10">
        {items.map((item) => (
          <div
            key={item.number}
            className="flex min-h-[112px] items-center gap-4 py-6 md:px-7 md:first:pl-0 md:last:pr-0"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c3b49d] text-[9px] font-semibold text-[#9a7b4e]">
              {item.number}
            </div>

            <div>
              <h3 className="text-[13px] font-semibold text-[#211d19]">
                {item.title}
              </h3>

              <p className="mt-1.5 max-w-xs text-[13px] leading-5 text-[#746d65]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
