import Link from "next/link";
import { getAdminProducts } from "@/lib/server/admin-products";
import { AdminProductsClient } from "@/components/admin/AdminProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 border-b border-[#ddd6cd] pb-7 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/admin"
              className="text-sm text-[#746d65] underline underline-offset-4"
            >
              ← Back to admin
            </Link>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#9a8f84]">
              Catalogue
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#181512]">
              Products
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#746d65]">
              Manage the products, pricing, variants and inventory shown by the
              boutique store.
            </p>
          </div>
        </div>

        <AdminProductsClient initialProducts={products} />
      </div>
    </main>
  );
}
