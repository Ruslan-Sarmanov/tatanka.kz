"use client";

import { useEffect, useState } from "react";
import { useFavoritesStore, type FavoriteItem } from "@/lib/favorites-store";
import { useLang } from "@/components/i18n/LangProvider";

// Zustand persist гидратируется из localStorage только после монтирования
// на клиенте — до этого момента "has" всегда вернёт false и иконка может
// на долю секунды мигнуть пустым сердечком при перезагрузке страницы.
// mounted-флаг убирает эту вспышку, не влияя на SSR (сервер всегда рисует
// пустое сердечко, что совпадает с первым клиентским рендером).
export default function FavoriteButton({
  item,
  className = "",
}: {
  item: FavoriteItem;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const toggle = useFavoritesStore((s) => s.toggle);
  const isFavorite = useFavoritesStore((s) => s.has(item.productId));
  const { dict } = useLang();

  useEffect(() => setMounted(true), []);
  const active = mounted && isFavorite;

  return (
    <button
      type="button"
      aria-label={active ? dict.product.removeFromFavorites : dict.product.addToFavorites}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(item);
      }}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-parchment/90 shadow-sm backdrop-blur transition hover:bg-parchment ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 transition ${active ? "fill-saddle-500 stroke-saddle-500" : "fill-none stroke-leather-700"}`}
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s-7.5-4.6-10-9.1C.4 8.5 2 5 5.5 5c2 0 3.5 1.1 4.5 2.6C11 6.1 12.5 5 14.5 5 18 5 19.6 8.5 22 11.9 19.5 16.4 12 21 12 21z"
        />
      </svg>
    </button>
  );
}
