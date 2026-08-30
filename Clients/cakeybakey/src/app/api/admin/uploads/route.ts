import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { isAdminAuthenticated } from "@/lib/server/admin-auth";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function getExtension(type: string) {
  switch (type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "bin";
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

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Image file is required." },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG or WebP images are allowed." },
        { status: 400 },
      );
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image must be between 1 byte and 8MB." },
        { status: 400 },
      );
    }

    const { env } = await getCloudflareContext();

    const key = `products/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${getExtension(file.type)}`;

    const fileBuffer = await file.arrayBuffer();

<<<<<<< HEAD
    await env.cakeybakey_products.put(key, fileBuffer, {
=======
    await env.fk_boutique_products.put(key, fileBuffer, {
>>>>>>> 5455781af8973d5af7f3babcd118fd551cdde8e2
      httpMetadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    const url = `/api/product-images/${key}`;

    return NextResponse.json({
      url,
      key,
    });
  } catch (error) {
    console.error("Product image upload failed:", error);

    const message =
      error instanceof Error
        ? error.message
        : String(error);

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "production"
            ? "Unable to upload image."
            : `Unable to upload image: ${message}`,
      },
      { status: 500 },
    );
  }
}
