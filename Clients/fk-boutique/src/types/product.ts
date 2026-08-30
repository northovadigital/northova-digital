export type ProductStatus = "draft" | "active" | "sold_out";

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
};

export type ProductVariant = {
  id: string;
  size?: string;
  color?: string;
  volumeMl?: number;
  price?: number;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: ProductImage[];
  variants: ProductVariant[];
  status: ProductStatus;
  featured: boolean;
  createdAt: string;
};
