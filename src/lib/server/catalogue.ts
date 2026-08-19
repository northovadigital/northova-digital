import { getDatabaseAsync } from "@/lib/server/db";

type InventoryVariantRow = {
  id: string;
  product_id: string;
  size: string | null;
  color: string | null;
  volume_ml: number | null;
  price: number | null;
  stock: number;
};

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
