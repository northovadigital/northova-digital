"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { AdminProduct } from "@/lib/server/admin-products";

type VariantDraft = {
  size: string;
  color: string;
  volumeMl: string;
  price: string;
  stock: string;
};

type Props = {
  initialProducts: AdminProduct[];
};

const emptyVariant = (): VariantDraft => ({
  size: "",
  color: "",
  volumeMl: "",
  price: "",
  stock: "0",
});

export function AdminProductsClient({ initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("fashion");
  const [basePrice, setBasePrice] = useState("");
  const [status, setStatus] = useState("active");
  const [featured, setFeatured] = useState(false);
  const [variants, setVariants] = useState<VariantDraft[]>([emptyVariant()]);

  function resetForm() {
    setName("");
    setSlug("");
    setDescription("");
    setCategory("fashion");
    setBasePrice("");
    setStatus("active");
    setFeatured(false);
    setVariants([emptyVariant()]);
    setMessage("");
    setError("");
  }

  function updateVariant(
    index: number,
    field: keyof VariantDraft,
    value: string,
  ) {
    setVariants((current) =>
      current.map((variant, variantIndex) =>
        variantIndex === index
          ? { ...variant, [field]: value }
          : variant,
      ),
    );
  }

  function removeVariant(index: number) {
    setVariants((current) =>
      current.length === 1
        ? current
        : current.filter((_, variantIndex) => variantIndex !== index),
    );
  }

  async function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          category,
          basePrice: Number(basePrice),
          status,
          featured,
          variants: variants.map((variant) => ({
            size: variant.size || null,
            color: variant.color || null,
            volumeMl: variant.volumeMl || null,
            price: variant.price || null,
            stock: Number(variant.stock || 0),
          })),
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        productId?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to create product.");
      }

      setMessage("Product created successfully.");
      resetForm();
      setShowForm(false);

      const refreshResponse = await fetch("/api/admin/products", {
        cache: "no-store",
      });

      if (refreshResponse.ok) {
        const refreshed = (await refreshResponse.json()) as {
          products: Array<Omit<AdminProduct, "variants">>;
          variants: Array<
            AdminProduct["variants"][number] & { product_id: string }
          >;
        };

        const variantsByProduct = new Map<
          string,
          AdminProduct["variants"]
        >();

        for (const variant of refreshed.variants) {
          const list = variantsByProduct.get(variant.product_id) ?? [];
          list.push({
            id: variant.id,
            size: variant.size,
            color: variant.color,
            volume_ml: variant.volume_ml,
            price: variant.price,
            stock: variant.stock,
          });
          variantsByProduct.set(variant.product_id, list);
        }

        setProducts(
          refreshed.products.map((product) => ({
            ...product,
            variants: variantsByProduct.get(product.id) ?? [],
          })),
        );
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create product.",
      );
    } finally {
      setSaving(false);
    }
  }

  const totalStock = (product: AdminProduct) =>
    product.variants.reduce((total, variant) => total + variant.stock, 0);

  async function deleteProduct(product: AdminProduct) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/products/${encodeURIComponent(product.id)}`,
        {
          method: "DELETE",
        },
      );

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Unable to delete product.");
      }

      setProducts((current) =>
        current.filter((item) => item.id !== product.id),
      );

      setMessage(`"${product.name}" deleted successfully.`);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete product.",
      );
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-[#746d65]">
            {products.length} {products.length === 1 ? "product" : "products"}{" "}
            in catalogue
          </p>

          {message && (
            <p className="mt-2 text-sm font-medium text-green-700">{message}</p>
          )}

          {error && (
            <p className="mt-2 text-sm font-medium text-red-700">{error}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm((current) => !current);
            setMessage("");
            setError("");
          }}
          className="rounded-full bg-[#181512] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#332d27]"
        >
          {showForm ? "Close form" : "+ Add product"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={submitProduct}
          className="mt-7 rounded-3xl border border-[#ddd6cd] bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a8f84]">
                New catalogue item
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#181512]">
                Add product
              </h2>
            </div>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <Field label="Product name">
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Signature Linen Set"
                className="admin-input"
              />
            </Field>

            <Field label="Slug">
              <input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="signature-linen-set"
                className="admin-input"
              />
              <p className="mt-1 text-xs text-[#9a8f84]">
                Leave empty to generate it from the product name.
              </p>
            </Field>

            <Field label="Category">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="admin-input"
              >
                <option value="fashion">Fashion</option>
                <option value="fragrances">Fragrances</option>
                <option value="home">Home & Living</option>
              </select>
            </Field>

            <Field label="Base price (PKR)">
              <input
                required
                min="0"
                step="1"
                type="number"
                value={basePrice}
                onChange={(event) => setBasePrice(event.target.value)}
                placeholder="4850"
                className="admin-input"
              />
            </Field>

            <Field label="Status">
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="admin-input"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="sold_out">Sold out</option>
              </select>
            </Field>

            <label className="flex items-center gap-3 rounded-2xl border border-[#e5ded5] px-4 py-3 text-sm text-[#403a34]">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) => setFeatured(event.target.checked)}
                className="h-4 w-4"
              />
              Show as featured product
            </label>

            <div className="md:col-span-2">
              <Field label="Description">
                <textarea
                  required
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe the product..."
                  rows={4}
                  className="admin-input resize-y"
                />
              </Field>
            </div>
          </div>

          <div className="mt-8 border-t border-[#e5ded5] pt-7">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-semibold text-[#181512]">
                  Variants
                </h3>
                <p className="mt-1 text-sm text-[#746d65]">
                  Add sizes, colours, volumes and stock levels where needed.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setVariants((current) => [...current, emptyVariant()])
                }
                className="rounded-full border border-[#cfc6bc] px-4 py-2 text-sm font-semibold text-[#403a34] transition hover:bg-[#f7f4ef]"
              >
                + Add variant
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-[#e5ded5] bg-[#fbfaf8] p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#403a34]">
                      Variant {index + 1}
                    </p>

                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-xs font-semibold text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <VariantField label="Size">
                      <input
                        value={variant.size}
                        onChange={(event) =>
                          updateVariant(index, "size", event.target.value)
                        }
                        placeholder="M"
                        className="admin-input"
                      />
                    </VariantField>

                    <VariantField label="Color">
                      <input
                        value={variant.color}
                        onChange={(event) =>
                          updateVariant(index, "color", event.target.value)
                        }
                        placeholder="Black"
                        className="admin-input"
                      />
                    </VariantField>

                    <VariantField label="Volume (ml)">
                      <input
                        min="0"
                        step="1"
                        type="number"
                        value={variant.volumeMl}
                        onChange={(event) =>
                          updateVariant(index, "volumeMl", event.target.value)
                        }
                        placeholder="50"
                        className="admin-input"
                      />
                    </VariantField>

                    <VariantField label="Price">
                      <input
                        min="0"
                        step="1"
                        type="number"
                        value={variant.price}
                        onChange={(event) =>
                          updateVariant(index, "price", event.target.value)
                        }
                        placeholder="Optional"
                        className="admin-input"
                      />
                    </VariantField>

                    <VariantField label="Stock">
                      <input
                        required
                        min="0"
                        step="1"
                        type="number"
                        value={variant.stock}
                        onChange={(event) =>
                          updateVariant(index, "stock", event.target.value)
                        }
                        className="admin-input"
                      />
                    </VariantField>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="rounded-full border border-[#cfc6bc] px-5 py-3 text-sm font-semibold text-[#403a34]"
            >
              Cancel
            </button>

            <button
              disabled={saving}
              type="submit"
              className="rounded-full bg-[#181512] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#332d27] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Create product"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-7 grid gap-4">
        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#cfc6bc] bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-[#181512]">
              No products yet
            </h2>
            <p className="mt-2 text-sm text-[#746d65]">
              Add your first product using the button above.
            </p>
          </div>
        ) : (
          products.map((product) => (
            <article
              key={product.id}
              className="rounded-3xl border border-[#ddd6cd] bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-[#181512]">
                      {product.name}
                    </h2>

                    <span className="rounded-full bg-[#f1ece6] px-3 py-1 text-xs font-medium text-[#746d65]">
                      {product.category}
                    </span>

                    <span className="rounded-full border border-[#e5ded5] px-3 py-1 text-xs font-medium text-[#746d65]">
                      {product.status}
                    </span>

                    {product.featured === 1 && (
                      <span className="rounded-full bg-[#181512] px-3 py-1 text-xs font-medium text-white">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#746d65]">
                    {product.description}
                  </p>
                </div>

                <div className="shrink-0 text-left lg:text-right">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#9a8f84]">
                    Base price
                  </p>
                  <p className="mt-1 text-xl font-semibold text-[#181512]">
                    PKR {product.base_price.toLocaleString()}
                  </p>

                  <div className="mt-4 flex gap-2 lg:justify-end">
                    <Link
                      href={`/admin/products/${encodeURIComponent(product.id)}/edit`}
                      className="rounded-full border border-[#cfc6bc] px-4 py-2 text-xs font-semibold text-[#403a34] transition hover:bg-[#f7f4ef]"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => void deleteProduct(product)}
                      className="rounded-full border border-[#e1b8b1] px-4 py-2 text-xs font-semibold text-[#9a554d] transition hover:bg-[#fbefec]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Stat label="Variants" value={String(product.variants.length)} />
                <Stat label="Total stock" value={String(totalStock(product))} />
                <Stat
                  label="Slug"
                  value={product.slug}
                  small
                />
              </div>

              {product.variants.length > 0 && (
                <div className="mt-5 overflow-x-auto rounded-2xl border border-[#e5ded5]">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-[#fbfaf8] text-xs uppercase tracking-[0.1em] text-[#9a8f84]">
                      <tr>
                        <th className="px-4 py-3">Size</th>
                        <th className="px-4 py-3">Color</th>
                        <th className="px-4 py-3">Volume</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5ded5]">
                      {product.variants.map((variant) => (
                        <tr key={variant.id}>
                          <td className="px-4 py-3 text-[#403a34]">
                            {variant.size || "—"}
                          </td>
                          <td className="px-4 py-3 text-[#403a34]">
                            {variant.color || "—"}
                          </td>
                          <td className="px-4 py-3 text-[#403a34]">
                            {variant.volume_ml
                              ? `${variant.volume_ml} ml`
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-[#403a34]">
                            {variant.price
                              ? `PKR ${variant.price.toLocaleString()}`
                              : "Base price"}
                          </td>
                          <td className="px-4 py-3 font-medium text-[#181512]">
                            {variant.stock}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </article>
          ))
        )}
      </div>

      <style jsx global>{`
        .admin-input {
          width: 100%;
          border-radius: 0.875rem;
          border: 1px solid #d8d0c7;
          background: #ffffff;
          padding: 0.7rem 0.85rem;
          font-size: 0.875rem;
          color: #181512;
          outline: none;
        }

        .admin-input:focus {
          border-color: #746d65;
          box-shadow: 0 0 0 3px rgba(116, 109, 101, 0.1);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#746d65]">
        {label}
      </span>
      {children}
    </label>
  );
}

function VariantField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-[#746d65]">
        {label}
      </span>
      {children}
    </label>
  );
}

function Stat({
  label,
  value,
  small = false,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-[#f7f4ef] px-4 py-3">
      <p className="text-xs uppercase tracking-[0.1em] text-[#9a8f84]">
        {label}
      </p>
      <p
        className={`mt-1 truncate font-semibold text-[#403a34] ${
          small ? "text-sm" : "text-base"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
