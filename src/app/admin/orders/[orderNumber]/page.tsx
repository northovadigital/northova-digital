"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type OrderItem = {
  id: string;
  product_name: string;
  size: string | null;
  volume_ml: number | null;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type OrderData = {
  order: {
    order_number: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string | null;
    address_line: string;
    area: string;
    city: string;
    payment_method: string;
    status: string;
    subtotal: number;
    delivery_fee: number;
    total: number;
    notes: string | null;
    created_at: string;
  };
  items: OrderItem[];
};

const statuses = [
  ["pending", "Pending"],
  ["confirmed", "Confirmed"],
  ["out_for_delivery", "Out for delivery"],
  ["delivered", "Delivered"],
  ["cancelled", "Cancelled"],
] as const;

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminOrderDetailPage() {
  const router = useRouter();

  const [data, setData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Order number is supplied by the pathname.
    const orderNumber = decodeURIComponent(
      window.location.pathname.split("/").pop() ?? "",
    );

    async function loadOrder() {
      try {
        const response = await fetch(
          `/api/admin/orders/${encodeURIComponent(orderNumber)}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Unable to load order.");
        }

        const result = (await response.json()) as OrderData;

        setData(result);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load order.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadOrder();
  }, []);

  async function handleStatusChange(status: string) {
    if (!data || updating || status === data.order.status) {
      return;
    }

    setUpdating(true);
    setError(null);

    const orderNumber = data.order.order_number;

    try {
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(orderNumber)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ?? "Unable to update status.",
        );
      }

      setData({
        ...data,
        order: {
          ...data.order,
          status,
        },
      });

      router.refresh();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update status.",
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] px-5 py-12">
        <div className="mx-auto max-w-6xl text-sm text-[#746d65]">
          Loading order...
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-[#9a554d]">
            {error ?? "Order not found."}
          </p>

          <Link
            href="/admin"
            className="mt-5 inline-flex rounded-full bg-[#181512] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to orders
          </Link>
        </div>
      </main>
    );
  }

  const { order, items } = data;

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="text-sm text-[#746d65] underline underline-offset-4"
        >
          ← Back to orders
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#9a7c50] uppercase">
              Order details
            </p>

            <h1 className="mt-2 font-serif text-4xl text-[#181512]">
              {order.order_number}
            </h1>
          </div>

          <select
            value={order.status}
            disabled={updating}
            onChange={(event) =>
              void handleStatusChange(event.target.value)
            }
            className="h-11 rounded-full border border-[#cec4b7] bg-[#fffdf9] px-5 text-sm font-semibold text-[#332d27]"
          >
            {statuses.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mt-5 rounded-xl bg-[#fbefec] p-4 text-sm text-[#8f564d]">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-2xl border border-[#ddd5c9] bg-[#fffdf9]">
            <div className="border-b border-[#e5ded4] px-5 py-4">
              <h2 className="font-serif text-2xl text-[#181512]">
                Items
              </h2>
            </div>

            <div className="divide-y divide-[#ece5dc]">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-[#332d27]">
                      {item.product_name}
                    </p>

                    <p className="mt-1 text-sm text-[#746d65]">
                      {item.volume_ml
                        ? `${item.volume_ml} ml`
                        : item.size ?? "Standard"}{" "}
                      · Qty {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-[#2f2924]">
                    {formatPrice(item.line_total)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#e5ded4] px-5 py-5">
              <div className="flex justify-between text-sm text-[#746d65]">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>

              <div className="mt-3 flex justify-between text-sm text-[#746d65]">
                <span>Delivery</span>
                <span>{formatPrice(order.delivery_fee)}</span>
              </div>

              <div className="mt-4 flex justify-between text-base font-semibold text-[#181512]">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-[#ddd5c9] bg-[#fffdf9] p-5">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-[#9a7c50] uppercase">
                Customer
              </p>

              <p className="mt-4 font-medium text-[#332d27]">
                {order.customer_name}
              </p>

              <p className="mt-2 text-sm text-[#746d65]">
                {order.customer_phone}
              </p>

              {order.customer_email && (
                <p className="mt-1 text-sm text-[#746d65]">
                  {order.customer_email}
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-[#ddd5c9] bg-[#fffdf9] p-5">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-[#9a7c50] uppercase">
                Delivery
              </p>

              <p className="mt-4 text-sm leading-6 text-[#453e37]">
                {order.address_line}
              </p>

              <p className="mt-1 text-sm text-[#746d65]">
                {order.area}, {order.city}
              </p>

              <p className="mt-4 text-sm font-semibold text-[#332d27]">
                {order.payment_method.toUpperCase()}
              </p>
            </section>

            {order.notes && (
              <section className="rounded-2xl border border-[#ddd5c9] bg-[#fffdf9] p-5">
                <p className="text-[10px] font-semibold tracking-[0.18em] text-[#9a7c50] uppercase">
                  Notes
                </p>

                <p className="mt-4 text-sm leading-6 text-[#453e37]">
                  {order.notes}
                </p>
              </section>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
