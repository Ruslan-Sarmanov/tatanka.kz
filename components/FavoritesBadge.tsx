"use client";

import Link from "next/link";
import { useFavoritesStore } from "@/lib/favorites-store";

export default function FavoritesBadge() {
  const count = useFavoritesStore((s) => s.items.length);

  return (
    <Link href="/favorites" aria-label="Избранное" className="relative flex items-center">
      <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-leather-800" strokeWidth={1.8} fill="none">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s-7.5-4.6-10-9.1C.4 8.5 2 5 5.5 5c2 0 3.5 1.1 4.5 2.6C11 6.1 12.5 5 14.5 5 18 5 19.6 8.5 22 11.9 19.5 16.4 12 21 12 21z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-leather-500 text-[10px] text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
