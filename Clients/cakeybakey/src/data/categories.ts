import type { StoreCategory } from "@/types/category";

export const storeCategories: StoreCategory[] = [
  {
    id: "fashion",
    name: "Women's Fashion",
    shortDescription:
      "Stitched and unstitched pieces selected for everyday wear, occasions and timeless wardrobes.",
    href: "/shop?category=fashion",
    eyebrow: "For her",
  },
  {
    id: "fragrances",
    name: "Fragrances",
    shortDescription:
      "A growing collection of scents for women and men, from fresh everyday notes to deeper signatures.",
    href: "/shop?category=fragrances",
    eyebrow: "For her & him",
  },
  {
    id: "home",
    name: "Home & Living",
    shortDescription:
      "Comfortable, thoughtfully selected bedsheets and home pieces designed for everyday living.",
    href: "/shop?category=home",
    eyebrow: "For your home",
  },
];
