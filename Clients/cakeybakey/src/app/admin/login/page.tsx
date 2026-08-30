"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ?? "Unable to sign in.",
        );
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in.",
      );
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ee] px-5">
      <div className="w-full max-w-md rounded-2xl border border-[#ddd5c9] bg-[#fffdf9] p-8 shadow-[0_20px_60px_rgba(30,24,20,0.08)]">
        <p className="text-[10px] font-semibold tracking-[0.22em] text-[#9a7c50] uppercase">
          F&K Boutique
        </p>

        <h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] text-[#181512]">
          Admin login
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#746d65]">
          Sign in to manage orders and store operations.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <label className="text-sm font-medium text-[#332d27]">
            Admin password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="mt-2 h-12 w-full rounded-lg border border-[#d8cfc1] bg-white px-4 text-sm outline-none focus:border-[#9a7c50]"
            required
          />

          {error && (
            <p className="mt-3 text-sm text-[#9a554d]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 min-h-12 w-full rounded-full bg-[#181512] px-6 text-sm font-semibold text-white transition hover:bg-[#35302b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
