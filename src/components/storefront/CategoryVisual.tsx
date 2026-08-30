type CategoryVisualProps = {
  categoryId: string;
  inverted?: boolean;
};

const categoryImages: Record<string, string> = {
  fashion: "/images/categories/fashion.jpg",
  fragrances: "/images/categories/fragrances.jpg",
  home: "/images/categories/home.jpg",
};

export function CategoryVisual({
  categoryId,
}: CategoryVisualProps) {
  const image = categoryImages[categoryId];

  if (!image) return null;

  return (
    <div
      aria-hidden="true"
      className="relative h-[210px] w-full overflow-hidden"
    >
      <img
        src={image}
        alt=""
        className="h-full w-full object-cover"
      />
    </div>
  );
}