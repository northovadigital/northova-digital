import { getDatabase } from "@/lib/server/db";

export type AdminOrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  address_line: string;
  area: string;
  city: string;
  payment_method: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminOrderItemRow = {
  id: string;
  product_id: string;
  product_name: string;
  variant_id: string | null;
  size: string | null;
  volume_ml: number | null;
  quantity: number;
  unit_price: number;
  line_total: number;
};

export type AdminOrderStatus =
  | "pending"
  | "confirmed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export async function getAdminOrders(filters?: {
  search?: string;
  status?: AdminOrderStatus | "all";
}) {
  const db = getDatabase();

  const search = filters?.search?.trim() ?? "";
  const status = filters?.status ?? "all";

  const conditions: string[] = [];
  const values: string[] = [];

  if (search) {
    conditions.push(
      `(
        order_number LIKE ?
        OR customer_name LIKE ?
        OR customer_phone LIKE ?
        OR customer_email LIKE ?
        OR area LIKE ?
      )`,
    );

    const pattern = `%${search}%`;

    values.push(
      pattern,
      pattern,
      pattern,
      pattern,
      pattern,
    );
  }

  if (status !== "all") {
    conditions.push("status = ?");
    values.push(status);
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  const result = await db
    .prepare(
      `SELECT
        id,
        order_number,
        customer_name,
        customer_phone,
        customer_email,
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
       FROM orders
       ${whereClause}
       ORDER BY created_at DESC`,
    )
    .bind(...values)
    .all<AdminOrderRow>();

  return result.results;
}

export async function getAdminOrder(
  orderNumber: string,
) {
  const db = getDatabase();

  const order = await db
    .prepare(
      `SELECT
        id,
        order_number,
        customer_name,
        customer_phone,
        customer_email,
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
       FROM orders
       WHERE order_number = ?
       LIMIT 1`,
    )
    .bind(orderNumber)
    .first<AdminOrderRow>();

  if (!order) {
    return null;
  }

  const items = await db
    .prepare(
      `SELECT
        id,
        product_id,
        product_name,
        variant_id,
        size,
        volume_ml,
        quantity,
        unit_price,
        line_total
       FROM order_items
       WHERE order_id = ?
       ORDER BY rowid ASC`,
    )
    .bind(order.id)
    .all<AdminOrderItemRow>();

  return {
    order,
    items: items.results,
  };
}

export async function updateAdminOrderStatus(
  orderNumber: string,
  status: AdminOrderStatus,
) {
  const db = getDatabase();
  const now = new Date().toISOString();

  const result = await db
    .prepare(
      `UPDATE orders
       SET status = ?, updated_at = ?
       WHERE order_number = ?`,
    )
    .bind(status, now, orderNumber)
    .run();

  return result.meta.changes === 1;
}
