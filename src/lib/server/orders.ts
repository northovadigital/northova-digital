import { randomUUID } from "crypto";

import { getDatabase } from "@/lib/server/db";

type OrderInputItem = {
  productId: string;
  variantId?: string;
  quantity: number;
};

type CreateOrderInput = {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  area: string;
  address: string;
  landmark?: string;
  city: "Karachi";
  notes?: string;
  items: OrderInputItem[];
};

type InventoryRow = {
  product_id: string;
  product_name: string;
  variant_id: string;
  size: string | null;
  volume_ml: number | null;
  price: number | null;
  base_price: number;
  stock: number;
};

type ResolvedOrderItem = {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  size: string | null;
  volumeMl: number | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export async function createOrder(input: CreateOrderInput) {
  const db = getDatabase();

  if (input.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const resolvedItems: ResolvedOrderItem[] = [];

  for (const item of input.items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new Error("Invalid item quantity.");
    }

    if (!item.variantId) {
      throw new Error("A product variant is required.");
    }

    const inventory = await db
      .prepare(
        `SELECT
          p.id AS product_id,
          p.name AS product_name,
          v.id AS variant_id,
          v.size,
          v.volume_ml,
          v.price,
          p.base_price,
          v.stock
        FROM product_variants v
        INNER JOIN products p
          ON p.id = v.product_id
        WHERE p.id = ?
          AND v.id = ?
          AND p.status = 'active'
        LIMIT 1`,
      )
      .bind(item.productId, item.variantId)
      .first<InventoryRow>();

    if (!inventory) {
      throw new Error("Product or variant is no longer available.");
    }

    const unitPrice =
      inventory.price ?? inventory.base_price;

    resolvedItems.push({
      id: randomUUID(),
      productId: inventory.product_id,
      productName: inventory.product_name,
      variantId: inventory.variant_id,
      size: inventory.size,
      volumeMl: inventory.volume_ml,
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
    });
  }

  const subtotal = resolvedItems.reduce(
    (total, item) => total + item.lineTotal,
    0,
  );

  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  const orderId = randomUUID();
  const now = new Date().toISOString();

  const orderNumber = `FK-${now
    .replace(/\D/g, "")
    .slice(0, 14)}-${Math.floor(
    Math.random() * 900 + 100,
  )}`;

  const orderStatement = db
    .prepare(
      `INSERT INTO orders (
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        address_line,
        area,
        city,
        payment_method,
        status,
        subtotal,
        delivery_fee,
        total,
        notes,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      orderId,
      orderNumber,
      input.customerName,
      input.customerEmail ?? null,
      input.customerPhone,
      input.address,
      input.area,
      input.city,
      "cod",
      "pending",
      subtotal,
      deliveryFee,
      total,
      input.notes ?? null,
      now,
      now,
    );

  const inventoryUpdates = resolvedItems.map((item) =>
    db
      .prepare(
        `UPDATE product_variants
         SET stock = stock - ?
         WHERE id = ?`,
      )
      .bind(item.quantity, item.variantId),
  );

  const itemStatements = resolvedItems.map((item) =>
    db
      .prepare(
        `INSERT INTO order_items (
          id,
          order_id,
          product_id,
          product_name,
          variant_id,
          size,
          volume_ml,
          quantity,
          unit_price,
          line_total
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        item.id,
        orderId,
        item.productId,
        item.productName,
        item.variantId,
        item.size,
        item.volumeMl,
        item.quantity,
        item.unitPrice,
        item.lineTotal,
      ),
  );

  await db.batch([
    ...inventoryUpdates,
    orderStatement,
    ...itemStatements,
  ]);

  return {
    id: orderId,
    orderNumber,
    status: "pending",
    subtotal,
    deliveryFee,
    total,
    items: resolvedItems,
  };
}
