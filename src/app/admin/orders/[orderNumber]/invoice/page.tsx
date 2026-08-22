"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminOrderInvoicePage() {
  const params = useParams<{ orderNumber: string }>();
  const orderNumber = decodeURIComponent(params.orderNumber);

  const [data, setData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [orderNumber]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] px-5 py-12">
        <div className="mx-auto max-w-4xl text-sm text-[#746d65]">
          Loading invoice...
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] px-5 py-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-[#9a554d]">
            {error ?? "Order not found."}
          </p>

          <Link
            href={`/admin/orders/${encodeURIComponent(orderNumber)}`}
            className="mt-5 inline-flex rounded-full bg-[#181512] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to order
          </Link>
        </div>
      </main>
    );
  }

  const { order, items } = data;

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 14mm;
          }

          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .invoice-page {
            min-height: auto !important;
            background: white !important;
            padding: 0 !important;
          }

          .invoice-card {
            border: 0 !important;
            box-shadow: none !important;
            max-width: none !important;
          }
        }
      `}</style>

      <main className="invoice-page min-h-screen bg-[#f7f4ee] px-5 py-8 sm:px-8 lg:px-10">
        <div className="no-print mx-auto mb-5 max-w-4xl">
          <header className="rounded-3xl border border-[#ddd5c9] bg-[#fffdf9] px-5 py-5 shadow-sm sm:px-7">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.22em] text-[#9a7c50] uppercase">
                  F&K Boutique
                </p>

                <h1 className="mt-2 font-serif text-3xl tracking-[-0.04em] text-[#181512]">
                  Invoice
                </h1>

                <p className="mt-2 text-sm text-[#746d65]">
                  {order.order_number}
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
                  className="inline-flex h-10 items-center rounded-full border border-[#cfc4b5] bg-[#fffdf9] px-5 text-sm font-semibold text-[#453e37] transition hover:bg-[#f8f2e8]"
                >
                  Products
                </Link>

                <Link
                  href="/admin/products/new"
                  className="inline-flex h-10 items-center rounded-full border border-[#9a7c50] px-5 text-sm font-semibold text-[#7d633e] transition hover:bg-[#f8f2e8]"
                >
                  + Add product
                </Link>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex h-10 items-center rounded-full bg-[#181512] px-5 text-sm font-semibold text-white transition hover:bg-[#332d27]"
                >
                  Print invoice
                </button>
              </nav>
            </div>
          </header>

          <div className="mt-4">
            <Link
              href={`/admin/orders/${encodeURIComponent(order.order_number)}`}
              className="text-sm font-medium text-[#746d65] underline underline-offset-4 transition hover:text-[#9a7c50]"
            >
              ← Back to order
            </Link>
          </div>
        </div>

        <article className="invoice-card mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[#ddd5c9] bg-[#fffdf9] shadow-sm">
          <header className="flex flex-col justify-between gap-6 border-b border-[#e5ded4] px-7 py-7 sm:flex-row sm:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a7c50]">
                Boutique Store
              </p>

              <h1 className="mt-2 font-serif text-4xl text-[#181512]">
                Invoice
              </h1>

              <p className="mt-2 text-sm text-[#746d65]">
                Thank you for your order.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs uppercase tracking-[0.16em] text-[#746d65]">
                Order
              </p>
              <p className="mt-1 text-lg font-semibold text-[#181512]">
                {order.order_number}
              </p>

              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[#746d65]">
                Date
              </p>
              <p className="mt-1 text-sm text-[#332d27]">
                {formatDate(order.created_at)}
              </p>
            </div>
          </header>

          <section className="grid gap-6 border-b border-[#e5ded4] px-7 py-6 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a7c50]">
                Bill to
              </p>

              <p className="mt-3 font-semibold text-[#181512]">
                {order.customer_name}
              </p>

              <p className="mt-1 text-sm text-[#746d65]">
                {order.customer_phone}
              </p>

              {order.customer_email && (
                <p className="mt-1 text-sm text-[#746d65]">
                  {order.customer_email}
                </p>
              )}
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a7c50]">
                Delivery
              </p>

              <p className="mt-3 text-sm leading-6 text-[#332d27]">
                {order.address_line}
                <br />
                {order.area}, {order.city}
              </p>
            </div>
          </section>

          <section className="px-7 py-6">
            <div className="overflow-hidden rounded-xl border border-[#e5ded4]">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#f7f4ee] text-left text-xs uppercase tracking-[0.12em] text-[#746d65]">
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-[#e5ded4]"
                    >
                      <td className="px-4 py-4">
                        <p className="font-medium text-[#332d27]">
                          {item.product_name}
                        </p>

                        <p className="mt-1 text-xs text-[#746d65]">
                          {item.volume_ml
                            ? `${item.volume_ml} ml`
                            : item.size ?? "Standard"}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-center text-[#332d27]">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-4 text-right text-[#332d27]">
                        {formatPrice(item.unit_price)}
                      </td>

                      <td className="px-4 py-4 text-right font-semibold text-[#181512]">
                        {formatPrice(item.line_total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ml-auto mt-6 max-w-sm">
              <div className="flex justify-between text-sm text-[#746d65]">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>

              <div className="mt-3 flex justify-between text-sm text-[#746d65]">
                <span>Delivery</span>
                <span>{formatPrice(order.delivery_fee)}</span>
              </div>

              <div className="mt-4 flex justify-between border-t border-[#e5ded4] pt-4 text-lg font-semibold text-[#181512]">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </section>

          <footer className="border-t border-[#e5ded4] bg-[#f7f4ee] px-7 py-5">
            <div className="flex flex-col gap-2 text-sm text-[#746d65] sm:flex-row sm:justify-between">
              <span>
                Payment:{" "}
                <strong className="font-semibold text-[#332d27]">
                  {order.payment_method}
                </strong>
              </span>

              <span>
                Status:{" "}
                <strong className="font-semibold capitalize text-[#332d27]">
                  {order.status.replaceAll("_", " ")}
                </strong>
              </span>
            </div>

            {order.notes && (
              <div className="mt-4 border-t border-[#e5ded4] pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a7c50]">
                  Order notes
                </p>
                <p className="mt-1 text-sm text-[#332d27]">{order.notes}</p>
              </div>
            )}
          </footer>
        </article>
      </main>
    </>
  );
}
