import { NextResponse } from "next/server";
import { getDatabaseAsync } from "@/lib/server/db";
import { isAdminAuthenticated } from "@/lib/server/admin-auth";

type RequestBody = {
  name?: unknown;
  slug?: unknown;
  description?: unknown;
  category?: unknown;
  basePrice?: unknown;
  status?: unknown;
  featured?: unknown;
  imageUrl?: unknown;
  imageUrls?: unknown;
  variants?: unknown;
};

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

async function authorize() {
  return await isAdminAuthenticated();
}



export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await authorize())) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    const { id } = await params;
    const db = await getDatabaseAsync();

    try {
      await db
        .prepare(`ALTER TABLE products ADD COLUMN image_url TEXT`)
} catch {
      // Column already exists.
    }


    const product = await db
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
        WHERE id = ?
        LIMIT 1
      `)
      .bind(id)
      .first();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

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
        WHERE product_id = ?
        ORDER BY rowid ASC
      `)
      .bind(id)
      .all();

    return NextResponse.json({
      product,
      variants: variants.results,
    });
  } catch (error) {
    console.error("Admin product GET failed:", error);

    return NextResponse.json(
      { error: "Unable to load product." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {

  // Ensure the product gallery column exists.





  try {
    if (!(await authorize())) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = (await request.json()) as RequestBody;

    const name = String(body.name ?? "").trim();
    const description = String(body.description ?? "").trim();
    const category = String(body.category ?? "").trim();
    const requestedSlug = String(body.slug ?? "").trim();
    const slug = slugify(requestedSlug || name);
    const basePrice = Number(body.basePrice);
    const status = String(body.status ?? "active");
    const featured = Boolean(body.featured);
    const imageUrl = String(body.imageUrl ?? "").trim();

  const imageUrls = Array.isArray(body.imageUrls)
    ? body.imageUrls
        .filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0,
        )
        .slice(0, 8)
    : imageUrl
      ? [imageUrl]
      : [];
    const variants = Array.isArray(body.variants) ? body.variants : [];

    if (!name || !description || !category) {
      return NextResponse.json(
        { error: "Name, description and category are required." },
        { status: 400 },
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "A valid product slug is required." },
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

    const product = await db
      .prepare(`SELECT id FROM products WHERE id = ? LIMIT 1`)
      .bind(id)
      .first();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    const duplicateSlug = await db
      .prepare(`
        SELECT id
        FROM products
        WHERE slug = ? AND id != ?
        LIMIT 1
      `)
      .bind(slug, id)
      .first();

    if (duplicateSlug) {
      return NextResponse.json(
        { error: "A product with this slug already exists." },
        { status: 409 },
      );
    }

    const statements = [
      db
        .prepare(`
          UPDATE products
          SET
            slug = ?,
            name = ?,
            description = ?,
            category = ?,
            base_price = ?,
            status = ?,
            featured = ?,
            image_url = ?,
            image_urls = ?
          WHERE id = ?
        `)
        .bind(
          slug,
          name,
          description,
          category,
          Math.round(basePrice),
          status,
          featured ? 1 : 0,
          imageUrl || null,
          JSON.stringify(imageUrls),
          id,
        ),

      db
        .prepare(`DELETE FROM product_variants WHERE product_id = ?`)
        .bind(id),
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
            id,
            variant.size ? String(variant.size).trim() : null,
            variant.color ? String(variant.color).trim() : null,
            volumeMl === null ? null : Math.round(volumeMl),
            price === null ? null : Math.round(price),
            Math.round(stock),
          ),
      );
    }

    await db.batch(statements);

    return NextResponse.json({
      success: true,
      productId: id,
      slug,
    });
  } catch (error) {
    console.error("Admin product PUT failed:", error);

    return NextResponse.json(
      { error: "Unable to update product." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await authorize())) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    const { id } = await params;
    const db = await getDatabaseAsync();

    const product = await db
      .prepare(`SELECT id FROM products WHERE id = ? LIMIT 1`)
      .bind(id)
      .first();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    await db
      .prepare(`DELETE FROM products WHERE id = ?`)
      .bind(id)
      .run()

    return NextResponse.json({
      success: true,
      productId: id,
    });
  } catch (error) {
    console.error("Admin product DELETE failed:", error);

    return NextResponse.json(
      { error: "Unable to delete product." },
      { status: 500 },
    );
  }
}
