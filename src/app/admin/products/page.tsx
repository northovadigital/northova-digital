import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/server/admin-auth";

import Link from "next/link";
import { getAdminProducts } from "@/lib/server/admin-products";
import { AdminProductsClient } from "@/components/admin/AdminProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }


  const products = await getAdminProducts();

  const totalStock = products.reduce(
    (total, product) =>
      total +
      product.variants.reduce(
        (variantTotal, variant) => variantTotal + variant.stock,
        0,
      ),
    0,
  );

  const activeProducts = products.filter(
    (product) => product.status === "active",
  ).length;

  const draftProducts = products.filter(
    (product) => product.status === "draft",
  ).length;

  const soldOutProducts = products.filter(
    (product) => product.status === "sold_out",
  ).length;

  const featuredProducts = products.filter(
    (product) => product.featured === 1,
  ).length;

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-[#ddd6cd] bg-[#fffdf9] px-5 py-5 shadow-sm sm:px-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.22em] text-[#9a7c50] uppercase">
                F&K Boutique
              </p>

              <h1 className="mt-2 font-serif text-4xl tracking-[-0.04em] text-[#181512]">
                Products
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#746d65]">
                Manage products, pricing, variants and boutique inventory.
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

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <ProductSummaryCard
            label="Total products"
            value={products.length}
          />

          <ProductSummaryCard
            label="Active"
            value={activeProducts}
          />

          <ProductSummaryCard
            label="Draft"
            value={draftProducts}
          />

          <ProductSummaryCard
            label="Sold out"
            value={soldOutProducts}
          />

          <ProductSummaryCard
            label="Featured"
            value={featuredProducts}
          />

          <ProductSummaryCard
            label="Total stock"
            value={totalStock}
          />
        </section>

        <AdminProductsClient initialProducts={products} />
      </div>
    </main>
  );
}


function ProductSummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-[#ddd6cd] bg-[#fffdf9] p-5 shadow-sm">
      <p className="text-[10px] font-semibold tracking-[0.15em] text-[#9a7c50] uppercase">
        {label}
      </p>

      <p className="mt-2 font-serif text-3xl text-[#181512]">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
