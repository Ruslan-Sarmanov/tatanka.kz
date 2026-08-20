"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import type { CartItem } from "@/lib/types";

export default function QuickAddButton({
  item,
  className = "",
  compact = false,
}: {
  item: Omit<CartItem, "quantity">;
  className?: string;
  // compact — узкая версия для тесных мест (например, рядом с ценой на
  // карточке в сетке каталога), просто короче подпись.
  compact?: boolean;
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
      className={`flex items-center justify-center gap-1.5 rounded-sm text-sm font-medium transition ${
        justAdded
          ? "bg-green-600 text-white"
          : "bg-saddle-500 text-parchment hover:bg-saddle-600"
      } ${compact ? "px-3 py-2" : "px-4 py-2.5"} ${className}`}
    >
      {justAdded ? (
        <>
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 stroke-white" strokeWidth={2.2} fill="none">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5 9.5 17 19 7" />
          </svg>
          В корзине
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 stroke-current" strokeWidth={1.8} fill="none">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 7h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5L6 7Z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7V6a3 3 0 0 1 6 0v1" />
          </svg>
          {compact ? "В корзину" : "Купить"}
        </>
      )}
    </button>
  );
}
