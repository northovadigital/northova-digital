import Link from "next/link";
import AdminProductEditForm from "@/components/admin/AdminProductEditForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a7c50]">
            Catalogue
          </p>

          <h1 className="mt-2 font-serif text-4xl tracking-[-0.04em] text-[#181512]">
            Edit product
          </h1>

          <p className="mt-2 text-sm text-[#746d65]">
            Update product details, variants and inventory.
          </p>
        </div>

        <div className="mt-8">
          <AdminProductEditForm productId={id} />
        </div>
      </div>
    </main>
  );
}
