"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type VariantDraft = {
  size: string;
  color: string;
  volumeMl: string;
  price: string;
  stock: string;
};

type Props = {
  productId: string;
};

type ProductResponse = {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    base_price: number;
    status: string;
    featured: number;
  };
  variants: Array<{
    id: string;
    size: string | null;
    color: string | null;
    volume_ml: number | null;
    price: number | null;
    stock: number;
  }>;
};

const emptyVariant = (): VariantDraft => ({
  size: "",
  color: "",
  volumeMl: "",
  price: "",
  stock: "0",
});

export default function AdminProductEditForm({ productId }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("fashion");
  const [basePrice, setBasePrice] = useState("");
  const [status, setStatus] = useState("active");
  const [featured, setFeatured] = useState(false);
  const [variants, setVariants] = useState<VariantDraft[]>([
    emptyVariant(),
  ]);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/admin/products/${productId}`, {
          cache: "no-store",
        });

        const data = (await response.json()) as ProductResponse & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to load product.");
        }

        setName(data.product.name);
        setSlug(data.product.slug);
        setDescription(data.product.description);
        setCategory(data.product.category);
        setBasePrice(String(data.product.base_price));
        setStatus(data.product.status);
        setFeatured(data.product.featured === 1);

        setVariants(
          data.variants.length > 0
            ? data.variants.map((variant) => ({
                size: variant.size ?? "",
                color: variant.color ?? "",
                volumeMl:
                  variant.volume_ml === null
                    ? ""
                    : String(variant.volume_ml),
                price:
                  variant.price === null ? "" : String(variant.price),
                stock: String(variant.stock),
              }))
            : [emptyVariant()],
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load product.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProduct();
  }, [productId]);

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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
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
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to update product.");
      }

      setMessage("Product updated successfully.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update product.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-[#ddd6cd] bg-white p-8 text-sm text-[#746d65]">
        Loading product...
      </div>
    );
  }

  if (error && !name) {
    return (
      <div className="rounded-3xl border border-red-200 bg-white p-8">
        <p className="font-medium text-red-700">{error}</p>
        <Link
          href="/admin/products"
          className="mt-4 inline-block text-sm font-semibold underline"
        >
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-7">
      <section className="rounded-3xl border border-[#ddd6cd] bg-white p-5 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-[#181512]">
          Product details
        </h2>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <Field label="Product name">
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="admin-edit-input"
            />
          </Field>

          <Field label="Slug">
            <input
              required
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              className="admin-edit-input"
            />
          </Field>

          <Field label="Category">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="admin-edit-input"
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
              className="admin-edit-input"
            />
          </Field>

          <Field label="Status">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="admin-edit-input"
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
                rows={5}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="admin-edit-input resize-y"
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#ddd6cd] bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-2xl text-[#181512]">
              Variants & inventory
            </h2>
            <p className="mt-1 text-sm text-[#746d65]">
              Update sizes, colours, volumes, prices and stock.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setVariants((current) => [...current, emptyVariant()])
            }
            className="rounded-full border border-[#cfc6bc] px-4 py-2 text-sm font-semibold text-[#403a34]"
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
                    className="admin-edit-input"
                  />
                </VariantField>

                <VariantField label="Color">
                  <input
                    value={variant.color}
                    onChange={(event) =>
                      updateVariant(index, "color", event.target.value)
                    }
                    placeholder="Black"
                    className="admin-edit-input"
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
                    className="admin-edit-input"
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
                    className="admin-edit-input"
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
                    className="admin-edit-input"
                  />
                </VariantField>
              </div>
            </div>
          ))}
        </div>
      </section>

      {message && (
        <p className="text-sm font-medium text-green-700">{message}</p>
      )}

      {error && <p className="text-sm font-medium text-red-700">{error}</p>}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/admin/products"
          className="rounded-full border border-[#cfc6bc] px-6 py-3 text-center text-sm font-semibold text-[#403a34]"
        >
          Cancel
        </Link>

        <button
          disabled={saving}
          type="submit"
          className="rounded-full bg-[#181512] px-7 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      <style jsx global>{`
        .admin-edit-input {
          width: 100%;
          border-radius: 0.875rem;
          border: 1px solid #d8d0c7;
          background: #ffffff;
          padding: 0.7rem 0.85rem;
          font-size: 0.875rem;
          color: #181512;
          outline: none;
        }

        .admin-edit-input:focus {
          border-color: #746d65;
          box-shadow: 0 0 0 3px rgba(116, 109, 101, 0.1);
        }
      `}</style>
    </form>
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
