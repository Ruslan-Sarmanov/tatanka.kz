"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/components/i18n/LangProvider";

export default function CatalogMenu({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { dict } = useLang();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-ink/80 transition hover:text-saddle-500"
      >
        {dict.header.catalog}
        <svg width="9" height="6" viewBox="0 0 9 6" className={`transition ${open ? "rotate-180" : ""}`}>
          <path d="M1 1L4.5 5L8 1" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-4 w-[560px] rounded-sm border border-saddle-100 bg-card p-6 shadow-xl">
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalog/${cat.slug}`}
                onClick={() => setOpen(false)}
                className="text-sm text-ink/80 transition hover:text-saddle-500"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
