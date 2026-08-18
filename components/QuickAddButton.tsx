"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import type { CartItem } from "@/lib/types";

export default function QuickAddButton({
  item,
  className = "",
}: {
  item: Omit<CartItem, "quantity">;
  className?: string;
}) {
  const add = useCartStore((s) => s.add);
  const [justAdded, setJustAdded] = useState(false);

  return (
    <button
      type="button"
      aria-label="Добавить в корзину"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add({ ...item, quantity: 1 });
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1200);
      }}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-parchment/90 shadow-sm backdrop-blur transition hover:bg-parchment ${className}`}
    >
      {justAdded ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-green-700" strokeWidth={2} fill="none">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5 9.5 17 19 7" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-leather-700" strokeWidth={1.8} fill="none">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 7h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5L6 7Z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7V6a3 3 0 0 1 6 0v1" />
        </svg>
      )}
    </button>
  );
}
