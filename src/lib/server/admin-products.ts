import { getDatabaseAsync } from "@/lib/server/db";

export type AdminProductVariant = {
  id: string;
  size: string | null;
  color: string | null;
  volume_ml: number | null;
  price: number | null;
  stock: number;
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  base_price: number;
  status: string;
  featured: number;
  created_at: string;
  variants: AdminProductVariant[];
};

type ProductRow = Omit<AdminProduct, "variants">;

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const db = await getDatabaseAsync();

  const products = await db
    .prepare(`
      SELECT
        id,
        slug,
        name,
        description,
        category,
        base_price,
        status,
        featured,
        created_at
      FROM products
      ORDER BY created_at DESC
    `)
    .all<ProductRow>();

  const variants = await db
    .prepare(`
      SELECT
        id,
        product_id,
        size,
        color,
        volume_ml,
        price,
        stock
      FROM product_variants
      ORDER BY rowid ASC
    `)
    .all<AdminProductVariant & { product_id: string }>();

  const variantsByProduct = new Map<string, AdminProductVariant[]>();

  for (const variant of variants.results) {
    const list = variantsByProduct.get(variant.product_id) ?? [];
    list.push({
      id: variant.id,
      size: variant.size,
      color: variant.color,
      volume_ml: variant.volume_ml,
      price: variant.price,
      stock: variant.stock,
    });
    variantsByProduct.set(variant.product_id, list);
  }

  return products.results.map((product) => ({
    ...product,
    variants: variantsByProduct.get(product.id) ?? [],
  }));
}
