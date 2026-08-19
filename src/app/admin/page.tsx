import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import {
  isAdminAuthenticated,
} from "@/lib/server/admin-auth";
import {
  getAdminOrders,
  type AdminOrderRow,
  type AdminOrderStatus,
} from "@/lib/server/admin-orders";

export const dynamic = "force-dynamic";

type AdminSearchParams = Promise<{
  q?: string;
  status?: string;
}>;

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const validStatuses = new Set<AdminOrderStatus | "all">([
  "all",
  "pending",
  "confirmed",
  "out_for_delivery",
  "delivered",
  "cancelled",
]);

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: AdminSearchParams;
}) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const params = await searchParams;

  const search = params.q?.trim() ?? "";

  const requestedStatus = params.status ?? "all";

  const status = validStatuses.has(
    requestedStatus as AdminOrderStatus | "all",
  )
    ? (requestedStatus as AdminOrderStatus | "all")
    : "all";

  const orders = await getAdminOrders({
    search,
    status,
  });

  const counts = {
    total: orders.length,
    pending: orders.filter(
      (order) => order.status === "pending",
    ).length,
    confirmed: orders.filter(
      (order) => order.status === "confirmed",
    ).length,
    outForDelivery: orders.filter(
      (order) => order.status === "out_for_delivery",
    ).length,
    delivered: orders.filter(
      (order) => order.status === "delivered",
    ).length,
    cancelled: orders.filter(
      (order) => order.status === "cancelled",
    ).length,
  };

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] text-[#9a7c50] uppercase">
              F&K Boutique
            </p>

            <h1 className="mt-2 font-serif text-4xl tracking-[-0.04em] text-[#181512]">
              Order dashboard
            </h1>

            <p className="mt-2 text-sm text-[#746d65]">
              {counts.total} matching order
              {counts.total === 1 ? "" : "s"}
            </p>
          </div>

          <AdminLogoutButton />
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <SummaryCard label="Total" value={counts.total} />
          <SummaryCard label="Pending" value={counts.pending} />
          <SummaryCard label="Confirmed" value={counts.confirmed} />
          <SummaryCard
            label="Out for delivery"
            value={counts.outForDelivery}
          />
          <SummaryCard label="Delivered" value={counts.delivered} />
          <SummaryCard label="Cancelled" value={counts.cancelled} />
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-[#ddd5c9] bg-[#fffdf9]">
          <div className="flex flex-col gap-4 border-b border-[#e5ded4] px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-serif text-2xl text-[#181512]">
                Orders
              </h2>

              {(search || status !== "all") && (
                <p className="mt-1 text-xs text-[#81786f]">
                  Filters are applied to this view.
                </p>
              )}
            </div>

            <form
              method="GET"
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="search"
                name="q"
                defaultValue={search}
                placeholder="Search order, customer, phone..."
                className="h-11 w-full rounded-full border border-[#cfc4b5] bg-[#fffdf9] px-5 text-sm text-[#332d27] outline-none transition placeholder:text-[#9a9187] focus:border-[#9a7c50] sm:w-[280px]"
              />

              <select
                name="status"
                defaultValue={status}
                className="h-11 rounded-full border border-[#cfc4b5] bg-[#fffdf9] px-5 text-sm font-semibold text-[#453e37] outline-none focus:border-[#9a7c50]"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="out_for_delivery">
                  Out for delivery
                </option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                type="submit"
                className="h-11 rounded-full bg-[#181512] px-6 text-sm font-semibold text-white transition hover:bg-[#35302b]"
              >
                Search
              </button>

              {(search || status !== "all") && (
                <Link
                  href="/admin"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[#cfc4b5] px-5 text-sm font-semibold text-[#453e37] transition hover:bg-[#f8f2e8]"
                >
                  Clear
                </Link>
              )}
            </form>
          </div>

          {orders.length === 0 ? (
            <div className="px-5 py-16 text-center text-sm text-[#746d65]">
              No orders match your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-[#f6f1e9] text-xs text-[#746d65]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      Order
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Customer
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Phone
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Area
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Payment
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Total
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Status
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#ece5dc]">
                  {orders.map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-[#ddd5c9] bg-[#fffdf9] p-5">
      <p className="text-[10px] font-semibold tracking-[0.15em] text-[#9a7c50] uppercase">
        {label}
      </p>

      <p className="mt-2 font-serif text-3xl text-[#181512]">
        {value}
      </p>
    </div>
  );
}

function OrderRow({
  order,
}: {
  order: AdminOrderRow;
}) {
  const createdAt = new Date(
    order.created_at,
  ).toLocaleString("en-PK");

  return (
    <tr className="text-sm text-[#453e37]">
      <td className="px-5 py-4 font-mono font-semibold">
        <Link
          href={`/admin/orders/${encodeURIComponent(order.order_number)}`}
          className="underline decoration-[#cbbfad] underline-offset-4 hover:text-[#9a7c50]"
        >
          {order.order_number}
        </Link>
      </td>

      <td className="px-5 py-4">
        {order.customer_name}
      </td>

      <td className="px-5 py-4">
        {order.customer_phone}
      </td>

      <td className="px-5 py-4">
        {order.area}
      </td>

      <td className="px-5 py-4 uppercase">
        {order.payment_method}
      </td>

      <td className="px-5 py-4 font-semibold">
        {formatPrice(order.total)}
      </td>

      <td className="px-5 py-4">
        <span className="rounded-full bg-[#eee8de] px-3 py-1.5 text-xs font-semibold">
          {statusLabels[order.status] ?? order.status}
        </span>
      </td>

      <td className="px-5 py-4 text-xs text-[#746d65]">
        {createdAt}
      </td>
    </tr>
  );
}
