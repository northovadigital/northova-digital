import { getDatabaseAsync } from "@/lib/server/db";
import type { Product, ProductStatus } from "@/types/product";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  base_price: number;
  status: string;
  featured: number;
  image_url: string | null;
  image_urls: string | null;
  created_at: string;
};

type InventoryVariantRow = {
  id: string;
  product_id: string;
  size: string | null;
  color: string | null;
  volume_ml: number | null;
  price: number | null;
  stock: number;
};

function normalizeStatus(value: string): ProductStatus {
  if (
    value === "draft" ||
    value === "sold_out" ||
    value === "active"
  ) {
    return value;
  }

  return "active";
}

export async function getProductCatalogue(): Promise<Product[]> {
  const db = await getDatabaseAsync();

  let products: ProductRow[] = [];

  try {
    const result = await db
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
          image_url,
        image_urls,
          created_at
        FROM products
        ORDER BY created_at DESC
      `)
      .all<ProductRow>();

    products = result.results;
  } catch (error) {
    console.error("Unable to load product catalogue:", error);
    return [];
  }

  if (products.length === 0) {
    return [];
  }

  const variantsResult = await db
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
    .all<InventoryVariantRow>();

  const variantsByProduct = new Map<string, InventoryVariantRow[]>();

  for (const variant of variantsResult.results) {
    const existing = variantsByProduct.get(variant.product_id) ?? [];
    existing.push(variant);
    variantsByProduct.set(variant.product_id, existing);
  }

  return products.map((product) => {
    const inventory = variantsByProduct.get(product.id) ?? [];

    const variants = inventory.map((variant) => ({
      id: variant.id,
      size: variant.size ?? undefined,
      color: variant.color ?? undefined,
      volumeMl: variant.volume_ml ?? undefined,
      price: variant.price ?? undefined,
      stock: variant.stock,
    }));

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: variants[0]?.price ?? product.base_price,
      category: product.category,
      imageUrl: product.image_url ?? undefined,
      images: (() => {
        const urls: string[] = [];

        if (product.image_url) {
          urls.push(product.image_url);
        }

        if (product.image_urls) {
          try {
            const parsed = JSON.parse(product.image_urls);

            if (Array.isArray(parsed)) {
              for (const url of parsed) {
                if (
                  typeof url === "string" &&
                  url.trim() &&
                  !urls.includes(url)
                ) {
                  urls.push(url);
                }
              }
            }
          } catch {
            // Ignore malformed gallery JSON.
          }
        }

        return urls.map((url, index) => ({
          id: `${product.id}-image-${index}`,
          url,
          alt: `${product.name} image ${index + 1}`,
        }));
      })(),
      variants,
      status: normalizeStatus(product.status),
      featured: Boolean(product.featured),
      createdAt: product.created_at,
    };
  });
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const products = await getProductCatalogue();

  return products.find((product) => product.slug === slug);
}

export async function getProductInventory(productId: string) {
  const db = await getDatabaseAsync();

  const result = await db
    .prepare(
      `SELECT
        id,
        product_id,
        size,
        color,
        volume_ml,
        price,
        stock
       FROM product_variants
       WHERE product_id = ?
       ORDER BY rowid ASC`,
    )
    .bind(productId)
    .all<InventoryVariantRow>();

  return result.results;
}
