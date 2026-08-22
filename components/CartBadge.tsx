"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

export default function CartBadge() {
  const count = useCartStore((s) =>
    s.items.reduce((n, i) => n + i.quantity, 0)
  );

  return (
    <Link href="/cart" aria-label="Корзина" className="relative flex items-center">
      <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-leather-800" strokeWidth={1.8} fill="none">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"
        />
        <circle cx="9.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="17.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-leather-500 text-[10px] text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
