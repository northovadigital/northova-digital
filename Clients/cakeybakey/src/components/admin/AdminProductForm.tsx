"use client";

import { useEffect, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type VariantForm = {
  size: string;
  color: string;
  volumeMl: string;
  price: string;
  stock: string;
};

const emptyVariant: VariantForm = {
  size: "",
  color: "",
  volumeMl: "",
  price: "",
  stock: "0",
};

type AdminProductFormProps = {
  initialImageUrl?: string;
};

export default function AdminProductForm({
  initialImageUrl = "",
}: AdminProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("fashion");
  const [basePrice, setBasePrice] = useState("");
  const [status, setStatus] = useState("active");
  const [featured, setFeatured] = useState(true);
  const [variants, setVariants] = useState<VariantForm[]>([
    { ...emptyVariant },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imageUrls, setImageUrls] = useState<string[]>(
    initialImageUrl ? [initialImageUrl] : [],
  );

  useEffect(() => {
    setImageUrls(initialImageUrl ? [initialImageUrl] : []);
  }, [initialImageUrl]);


  function updateVariant(
    index: number,
    field: keyof VariantForm,
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

  function addVariant() {
    setVariants((current) => [
      ...current,
      { ...emptyVariant },
    ]);
  }

  function removeVariant(index: number) {
    setVariants((current) =>
      current.length === 1
        ? current
        : current.filter(
            (_, variantIndex) => variantIndex !== index,
          ),
    );
  }

  function removeImage(index: number) {
    setImageUrls((current) =>
      current.filter((_, imageIndex) => imageIndex !== index),
    );
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImageUrls((current) => {
      const target = index + direction;

      if (
        index < 0 ||
        index >= current.length ||
        target < 0 ||
        target >= current.length
      ) {
        return current;
      }

      const next = [...current];

      [next[index], next[target]] = [
        next[target],
        next[index],
      ];

      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({

          imageUrls,
          imageUrl: imageUrls[0] || null,
          name,
          slug,
          description,
          category,
          basePrice: Number(basePrice),
          status,
          featured,
          variants: variants.map((variant) => ({
            size: variant.size,
            color: variant.color,
            volumeMl:
              variant.volumeMl === ""
                ? null
                : Number(variant.volumeMl),
            price:
              variant.price === ""
                ? null
                : Number(variant.price),
            stock: Number(variant.stock),
          })),
        }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ?? "Unable to create product.",
        );
      }

      router.push("/admin/products");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create product.",
      );
      setSaving(false);
    }
  }


  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      body: formData,
    });

    const result = (await response.json()) as {
      url?: string;
      error?: string;
    };

    if (!response.ok || !result.url) {
      throw new Error(
        result.error ?? "Unable to upload image.",
      );
    }

    return result.url;
  }

  async function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    if (imageUrls.length + files.length > 8) {
      setError("You can have up to 8 product images.");
      event.target.value = "";
      return;
    }

    try {
      setError("");

      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          if (
            ![
              "image/jpeg",
              "image/png",
              "image/webp",
            ].includes(file.type)
          ) {
            throw new Error(
              "Only JPG, PNG or WebP images are allowed.",
            );
          }

          if (file.size <= 0 || file.size > 8 * 1024 * 1024) {
            throw new Error(
              "Each image must be smaller than 8MB.",
            );
          }

          return uploadImage(file);
        }),
      );

      setImageUrls((current) =>
        [...current, ...uploadedUrls].slice(0, 8),
      );

      event.target.value = "";
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload images.",
      );
      event.target.value = "";
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-[#ddd5c9] bg-[#fffdf9] p-5 sm:p-7">
        <h2 className="font-serif text-2xl text-[#181512]">
          Product details
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Product name">
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Summer Lawn Set"
              className="input"
            />
          </Field>

          <Field label="Slug">
            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="summer-lawn-set"
              className="input"
            />
          </Field>

          <Field label="Category">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="input"
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
              onChange={(event) =>
                setBasePrice(event.target.value)
              }
              placeholder="4850"
              className="input"
            />
          </Field>
        </div>

        <Field label="Description" className="mt-5">
          <textarea
            required
            rows={4}
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Describe the product..."
            className="input resize-y"
          />
        </Field>

        <div className="mt-5 flex flex-wrap gap-5">
          <label className="flex items-center gap-3 text-sm font-semibold text-[#453e37]">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) =>
                setFeatured(event.target.checked)
              }
              className="h-4 w-4"
            />
            Featured product
          </label>

          <label className="flex items-center gap-3 text-sm font-semibold text-[#453e37]">
            Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-full border border-[#cfc4b5] bg-[#fffdf9] px-4 py-2 font-normal"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="sold_out">Sold out</option>
            </select>
          </label>
        </div>

          <section
            data-product-image-uploader
            className="mt-6 rounded-2xl border border-[#ddd5c9] bg-[#fffdf9] p-5"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-[#9a7c50] uppercase">
                  Product gallery
                </p>

                <p className="mt-1 text-xs text-[#81776d]">
                  Add up to 8 images. The first image becomes the catalogue cover.
                </p>
              </div>

              <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-[#181512] px-5 text-sm font-semibold text-white transition hover:bg-[#37322c]">
                + Add images
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
            </div>

            {imageUrls.length > 0 ? (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {imageUrls.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="relative overflow-hidden rounded-2xl border border-[#ddd5c9] bg-[#f7f4ee]"
                  >
                    <div className="flex aspect-square items-center justify-center p-2">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-[#181512]/90 px-2.5 py-1 text-[9px] font-semibold tracking-[0.12em] text-white uppercase">
                        Cover
                      </span>
                    )}

                    <div className="absolute inset-x-2 bottom-2 flex justify-center gap-1.5">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => moveImage(index, -1)}
                          className="h-8 w-8 rounded-full bg-white/95 text-sm font-semibold shadow-sm"
                          aria-label="Move image left"
                        >
                          ←
                        </button>
                      )}

                      {index < imageUrls.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveImage(index, 1)}
                          className="h-8 w-8 rounded-full bg-white/95 text-sm font-semibold shadow-sm"
                          aria-label="Move image right"
                        >
                          →
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="h-8 w-8 rounded-full bg-white/95 text-xs font-semibold text-[#9a655d] shadow-sm"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <label className="mt-5 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#cbbfad] bg-white px-5 text-center transition hover:border-[#9a7c50] hover:bg-[#fffdf9]">
                <span className="text-3xl">↑</span>

                <span className="mt-3 text-sm font-semibold text-[#403932]">
                  Choose product images
                </span>

                <span className="mt-1 text-xs text-[#81776d]">
                  JPG, PNG or WEBP · up to 8 images · maximum 8MB each
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
            )}
          </section>

</section>

      <section className="rounded-2xl border border-[#ddd5c9] bg-[#fffdf9] p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-2xl text-[#181512]">
              Variants & inventory
            </h2>

            <p className="mt-1 text-sm text-[#746d65]">
              Add sizes, colours, volumes, prices and stock.
            </p>
          </div>

          <button
            type="button"
            onClick={addVariant}
            className="rounded-full border border-[#cfc4b5] px-5 py-2.5 text-sm font-semibold text-[#453e37] transition hover:bg-[#f7f1e8]"
          >
            + Add variant
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="rounded-xl border border-[#e5ded4] bg-[#f8f4ee] p-4"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Field label="Size">
                  <input
                    value={variant.size}
                    onChange={(event) =>
                      updateVariant(
                        index,
                        "size",
                        event.target.value,
                      )
                    }
                    placeholder="S / M / L"
                    className="input"
                  />
                </Field>

                <Field label="Color">
                  <input
                    value={variant.color}
                    onChange={(event) =>
                      updateVariant(
                        index,
                        "color",
                        event.target.value,
                      )
                    }
                    placeholder="Black"
                    className="input"
                  />
                </Field>

                <Field label="Volume (ml)">
                  <input
                    min="0"
                    step="1"
                    type="number"
                    value={variant.volumeMl}
                    onChange={(event) =>
                      updateVariant(
                        index,
                        "volumeMl",
                        event.target.value,
                      )
                    }
                    placeholder="50"
                    className="input"
                  />
                </Field>

                <Field label="Price (PKR)">
                  <input
                    min="0"
                    step="1"
                    type="number"
                    value={variant.price}
                    onChange={(event) =>
                      updateVariant(
                        index,
                        "price",
                        event.target.value,
                      )
                    }
                    placeholder="Optional"
                    className="input"
                  />
                </Field>

                <Field label="Stock">
                  <input
                    required
                    min="0"
                    step="1"
                    type="number"
                    value={variant.stock}
                    onChange={(event) =>
                      updateVariant(
                        index,
                        "stock",
                        event.target.value,
                      )
                    }
                    className="input"
                  />
                </Field>
              </div>

              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="mt-4 text-xs font-semibold text-[#9a554d] underline underline-offset-4"
                >
                  Remove variant
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {error && (
        <div className="rounded-xl bg-[#fbefec] p-4 text-sm text-[#8f564d]">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-full border border-[#cfc4b5] px-6 py-3 text-sm font-semibold text-[#453e37] transition hover:bg-[#f7f1e8]"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#181512] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#332d27] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save product"}
        </button>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #cfc4b5;
          background: #fffdf9;
          padding: 0.7rem 0.9rem;
          font-size: 0.875rem;
          color: #332d27;
          outline: none;
        }

        .input:focus {
          border-color: #9a7c50;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[10px] font-semibold tracking-[0.14em] text-[#9a7c50] uppercase">
        {label}
      </span>

      {children}
    </label>
  );
}
