import type { Product } from "@/types/product";

export const featuredProducts: Product[] = [
  {
    id: "fk-fashion-001",
    slug: "embroidered-lawn-ensemble",
    name: "Embroidered Lawn Ensemble",
    description:
      "A graceful unstitched lawn set designed for polished everyday wear.",
    price: 4850,
    category: "fashion",
    images: [],
    variants: [
      {
        id: "fk-fashion-001-default",
        stock: 3,
      },
    ],
    status: "active",
    featured: true,
    createdAt: "2026-08-13T00:00:00+05:00",
  },
  {
    id: "fk-fragrance-001",
    slug: "velvet-oud",
    name: "Velvet Oud",
    description:
      "A warm woody fragrance with a rich, confident evening character.",
    price: 3950,
    category: "fragrances",
    images: [],
    variants: [
      {
        id: "fk-fragrance-001-50ml",
        volumeMl: 50,
        price: 3950,
        stock: 5,
      },
      {
        id: "fk-fragrance-001-100ml",
        volumeMl: 100,
        price: 6750,
        stock: 3,
      },
    ],
    status: "active",
    featured: true,
    createdAt: "2026-08-13T00:00:00+05:00",
  },
  {
    id: "fk-home-001",
    slug: "signature-cotton-bedsheet",
    name: "Signature Cotton Bedsheet",
    description:
      "A comfortable cotton bedsheet set in a calm, versatile palette.",
    price: 3250,
    category: "home",
    images: [],
    variants: [
      {
        id: "fk-home-001-default",
        stock: 4,
      },
    ],
    status: "active",
    featured: true,
    createdAt: "2026-08-13T00:00:00+05:00",
  },
  {
    id: "fk-fashion-002",
    slug: "classic-three-piece-suit",
    name: "Classic Three-Piece Suit",
    description:
      "An elegant three-piece look suited to gatherings and occasion dressing.",
    price: 7850,
    category: "fashion",
    images: [],
    variants: [
      {
        id: "fk-fashion-002-small",
        size: "S",
        price: 7850,
        stock: 1,
      },
      {
        id: "fk-fashion-002-medium",
        size: "M",
        price: 7850,
        stock: 2,
      },
      {
        id: "fk-fashion-002-large",
        size: "L",
        price: 7850,
        stock: 1,
      },
    ],
    status: "active",
    featured: true,
    createdAt: "2026-08-13T00:00:00+05:00",
  },
  {
    id: "fk-fragrance-002",
    slug: "white-musk",
    name: "White Musk",
    description:
      "A clean, soft fragrance created for effortless everyday wear.",
    price: 2950,
    category: "fragrances",
    images: [],
    variants: [
      {
        id: "fk-fragrance-002-50ml",
        volumeMl: 50,
        price: 2950,
        stock: 6,
      },
      {
        id: "fk-fragrance-002-100ml",
        volumeMl: 100,
        price: 4950,
        stock: 4,
      },
    ],
    status: "active",
    featured: true,
    createdAt: "2026-08-13T00:00:00+05:00",
  },
  {
    id: "fk-home-002",
    slug: "hotel-stripe-bedding-set",
    name: "Hotel Stripe Bedding Set",
    description:
      "A refined bedding set inspired by crisp, understated hotel styling.",
    price: 5650,
    category: "home",
    images: [],
    variants: [
      {
        id: "fk-home-002-default",
        stock: 3,
      },
    ],
    status: "active",
    featured: true,
    createdAt: "2026-08-13T00:00:00+05:00",
  },
];
