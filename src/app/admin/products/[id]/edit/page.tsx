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
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-3xl border border-[#ddd5c9] bg-[#fffdf9] px-5 py-5 shadow-sm sm:px-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.22em] text-[#9a7c50] uppercase">
                F&K Boutique
              </p>

              <h1 className="mt-2 font-serif text-4xl tracking-[-0.04em] text-[#181512]">
                Edit product
              </h1>

              <p className="mt-2 text-sm text-[#746d65]">
                Update product details, variants and inventory.
              </p>
            </div>

            <nav className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin"
                className="inline-flex h-10 items-center rounded-full border border-[#cfc4b5] bg-[#fffdf9] px-5 text-sm font-semibold text-[#453e37] transition hover:bg-[#f8f2e8]"
              >
                Orders
              </Link>

              <Link
                href="/admin/products"
                className="inline-flex h-10 items-center rounded-full bg-[#181512] px-5 text-sm font-semibold text-white transition hover:bg-[#35302b]"
              >
                Products
              </Link>

              <Link
                href="/admin/products/new"
                className="inline-flex h-10 items-center rounded-full border border-[#9a7c50] px-5 text-sm font-semibold text-[#7d633e] transition hover:bg-[#f8f2e8]"
              >
                + Add product
              </Link>
            </nav>
          </div>
        </header>

        <div className="mt-5">
          <Link
            href="/admin/products"
            className="text-sm font-medium text-[#746d65] underline underline-offset-4 transition hover:text-[#9a7c50]"
          >
            ← Back to products
          </Link>
        </div>

        <div className="mt-6">
          <AdminProductEditForm productId={id} />
        </div>
      </div>
    </main>
  );
}
