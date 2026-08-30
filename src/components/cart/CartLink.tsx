"use client";

import Link from "next/link";

import { useCart } from "@/context/CartContext";

export function CartLink() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#181512] px-5 text-sm font-medium text-white transition hover:bg-[#35302b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a7c50]"
    >
      Cart · {itemCount}
    </Link>
  );
}
