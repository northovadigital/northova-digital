
async function readImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image file.");
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image must be smaller than 8MB.");
  }

  const bitmap = await createImageBitmap(file);
  const maxSize = 1000;

  const scale = Math.min(
    1,
    maxSize / Math.max(bitmap.width, bitmap.height),
  );

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to process image.");
  }

  context.drawImage(
    bitmap,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvas.toDataURL("image/jpeg", 0.82);
}

import Link from "next/link";

import AdminProductForm from "@/components/admin/AdminProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/products"
          className="text-sm text-[#746d65] underline underline-offset-4"
        >
          ← Back to products
        </Link>

        <div className="mt-6">
          <p className="text-[10px] font-semibold tracking-[0.22em] text-[#9a7c50] uppercase">
            Catalogue
          </p>

          <h1 className="mt-2 font-serif text-4xl tracking-[-0.04em] text-[#181512]">
            Add product
          </h1>

          <p className="mt-2 text-sm text-[#746d65]">
            Add a product and its variants to the boutique catalogue.
          </p>
        </div>

        <div className="mt-8">
          <AdminProductForm />
        </div>
      </div>
    </main>
  );
}
