"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileNav({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
      >
        <span className={`h-px w-5 bg-ink transition ${open ? "translate-y-[3px] rotate-45" : ""}`} />
        <span className={`h-px w-5 bg-ink transition ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-20 border-b border-saddle-100 bg-parchment px-5 py-6 shadow-lg">
          <nav className="flex flex-col gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalog/${cat.slug}`}
                onClick={() => setOpen(false)}
                className="font-display text-lg text-ink transition hover:text-saddle-500"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
