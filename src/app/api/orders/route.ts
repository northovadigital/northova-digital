import { NextResponse } from "next/server";

import {
  createOrder,
  InsufficientStockError,
  InventoryChangedError,
} from "@/lib/server/orders";

type RequestBody = {
  customerName?: unknown;
  customerEmail?: unknown;
  customerPhone?: unknown;
  area?: unknown;
  address?: unknown;
  landmark?: unknown;
  city?: unknown;
  notes?: unknown;
  items?: unknown;
};

function asOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : undefined;
}

function asRequiredString(
  value: unknown,
  field: string,
): string {
  const result = asOptionalString(value);

  if (!result) {
    throw new Error(`${field} is required.`);
  }

  return result;
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as RequestBody;

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 },
      );
    }

    const items = body.items.map((item) => {
      if (!item || typeof item !== "object") {
        throw new Error("Invalid cart item.");
      }

      const value = item as Record<string, unknown>;

      const productId = asRequiredString(
        value.productId,
        "Product",
      );

      const variantId =
        asOptionalString(value.variantId);

      const slug =
        asOptionalString(value.slug);

      const size =
        asOptionalString(value.size);

      const rawVolumeMl = value.volumeMl;
      const volumeMl =
        rawVolumeMl === null ||
        rawVolumeMl === undefined ||
        rawVolumeMl === ""
          ? undefined
          : Number(rawVolumeMl);

      if (
        volumeMl !== undefined &&
        (!Number.isFinite(volumeMl) || volumeMl < 0)
      ) {
        throw new Error("Invalid product volume.");
      }

      const quantity = Number(value.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error(
          "Each product must have a valid quantity.",
        );
      }

      return {
        productId,
        variantId,
        slug,
        size,
        volumeMl,
        quantity,
      };
    });

    const city = asRequiredString(body.city, "City");

    if (city !== "Karachi") {
      return NextResponse.json(
        {
          error:
            "Orders are currently available in Karachi only.",
        },
        { status: 400 },
      );
    }

    const order = await createOrder({
      customerName: asRequiredString(
        body.customerName,
        "Customer name",
      ),
      customerEmail: asOptionalString(
        body.customerEmail,
      ),
      customerPhone: asRequiredString(
        body.customerPhone,
        "Phone number",
      ),
      area: asRequiredString(body.area, "Area"),
      address: asRequiredString(
        body.address,
        "Address",
      ),
      landmark: asOptionalString(body.landmark),
      city: "Karachi",
      notes: asOptionalString(body.notes),
      items,
    });

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof InsufficientStockError) {
      return NextResponse.json(
        {
          error: error.code,
          message: error.message,
          available: error.available,
          productName: error.productName,
          variantLabel: error.variantLabel,
        },
        { status: 409 },
      );
    }

    if (error instanceof InventoryChangedError) {
      return NextResponse.json(
        {
          error: error.code,
          message: error.message,
        },
        { status: 409 },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create order.";

    return NextResponse.json(
      { error: message },
      { status: 400 },
    );
  }
}
