import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/server/admin-auth";
import {
  getAdminOrder,
  updateAdminOrderStatus,
} from "@/lib/server/admin-orders";

const allowedStatuses = new Set([
  "pending",
  "confirmed",
  "out_for_delivery",
  "delivered",
  "cancelled",
]);

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ orderNumber: string }>;
  },
) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
  }

  const { orderNumber } = await params;
  const result = await getAdminOrder(orderNumber);

  if (!result) {
    return NextResponse.json(
      { error: "Order not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(result);
}

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ orderNumber: string }>;
  },
) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
  }

  try {
    const { orderNumber } = await params;
    const body = (await request.json()) as {
      status?: unknown;
    };

    const status =
      typeof body.status === "string"
        ? body.status
        : "";

    if (!allowedStatuses.has(status)) {
      return NextResponse.json(
        { error: "Invalid order status." },
        { status: 400 },
      );
    }

    const updated = await updateAdminOrderStatus(
      orderNumber,
      status as
        | "pending"
        | "confirmed"
        | "out_for_delivery"
        | "delivered"
        | "cancelled",
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      status,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to update order status." },
      { status: 500 },
    );
  }
}
