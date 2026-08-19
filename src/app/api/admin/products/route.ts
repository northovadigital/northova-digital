import { NextResponse } from "next/server";
import { getDatabaseAsync } from "@/lib/server/db";
import { isAdminAuthenticated } from "@/lib/server/admin-auth";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

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
      .all();

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
      .all();

    return NextResponse.json({
      products: products.results,
      variants: variants.results,
    });
  } catch (error) {
    console.error("Admin products GET failed:", error);

    return NextResponse.json(
      { error: "Unable to load products." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    const body = (await request.json()) as {
      name?: unknown;
      description?: unknown;
      category?: unknown;
      basePrice?: unknown;
      status?: unknown;
      featured?: unknown;
      slug?: unknown;
      variants?: unknown;
    };

    const name = String(body.name ?? "").trim();
    const description = String(body.description ?? "").trim();
    const category = String(body.category ?? "").trim();
    const basePrice = Number(body.basePrice);
    const status = String(body.status ?? "active");
    const featured = Boolean(body.featured);
    const variants = Array.isArray(body.variants) ? body.variants : [];

    if (!name || !description || !category) {
      return NextResponse.json(
        { error: "Name, description and category are required." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(basePrice) || basePrice < 0) {
      return NextResponse.json(
        { error: "Base price must be a valid non-negative number." },
        { status: 400 },
      );
    }

    if (!["active", "draft", "sold_out"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid product status." },
        { status: 400 },
      );
    }

    const db = await getDatabaseAsync();

    const requestedSlug = String(body.slug ?? "").trim();
    const slug = slugify(requestedSlug || name);

    if (!slug) {
      return NextResponse.json(
        { error: "A valid product slug is required." },
        { status: 400 },
      );
    }

    const existing = await db
      .prepare(`SELECT id FROM products WHERE slug = ? LIMIT 1`)
      .bind(slug)
      .first();

    if (existing) {
      return NextResponse.json(
        { error: "A product with this slug already exists." },
        { status: 409 },
      );
    }

    const productId = createId("product");
    const createdAt = new Date().toISOString();

    const statements = [
      db
        .prepare(`
          INSERT INTO products (
            id,
            slug,
            name,
            description,
            category,
            base_price,
            status,
            featured,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          productId,
          slug,
          name,
          description,
          category,
          Math.round(basePrice),
          status,
          featured ? 1 : 0,
          createdAt,
        ),
    ];

    for (const variant of variants) {
      const stock = Number(variant.stock ?? 0);
      const price =
        variant.price === null ||
        variant.price === undefined ||
        variant.price === ""
          ? null
          : Number(variant.price);

      const volumeMl =
        variant.volumeMl === null ||
        variant.volumeMl === undefined ||
        variant.volumeMl === ""
          ? null
          : Number(variant.volumeMl);

      if (!Number.isFinite(stock) || stock < 0) {
        return NextResponse.json(
          { error: "Variant stock must be a non-negative number." },
          { status: 400 },
        );
      }

      if (price !== null && (!Number.isFinite(price) || price < 0)) {
        return NextResponse.json(
          { error: "Variant price must be a valid non-negative number." },
          { status: 400 },
        );
      }

      if (
        volumeMl !== null &&
        (!Number.isFinite(volumeMl) || volumeMl <= 0)
      ) {
        return NextResponse.json(
          { error: "Variant volume must be a positive number." },
          { status: 400 },
        );
      }

      statements.push(
        db
          .prepare(`
            INSERT INTO product_variants (
              id,
              product_id,
              size,
              color,
              volume_ml,
              price,
              stock
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `)
          .bind(
            createId("variant"),
            productId,
            variant.size ? String(variant.size).trim() : null,
            variant.color ? String(variant.color).trim() : null,
            volumeMl === null ? null : Math.round(volumeMl),
            price === null ? null : Math.round(price),
            Math.round(stock),
          ),
      );
    }

    await db.batch(statements);

    return NextResponse.json(
      {
        success: true,
        productId,
        slug,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin products POST failed:", error);

    return NextResponse.json(
      { error: "Unable to create product." },
      { status: 500 },
    );
  }
}
