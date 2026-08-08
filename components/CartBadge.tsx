"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

export default function CartBadge() {
  const count = useCartStore((s) =>
    s.items.reduce((n, i) => n + i.quantity, 0)
  );

  return (
    <Link href="/cart" className="relative text-sm font-medium text-leather-800">
      Корзина
      {count > 0 && (
        <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-leather-500 text-xs text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
