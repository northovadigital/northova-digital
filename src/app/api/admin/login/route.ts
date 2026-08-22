import { NextResponse } from "next/server";

import {
  createAdminSession,
  getAdminPassword,
  setAdminSession,
} from "@/lib/server/admin-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      password?: unknown;
    };

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!password || password !== getAdminPassword()) {
      return NextResponse.json(
        { error: "Invalid admin password." },
        { status: 401 },
      );
    }

    const session = await createAdminSession();

    await setAdminSession(session);

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Admin authentication is not configured." },
      { status: 500 },
    );
  }
}
