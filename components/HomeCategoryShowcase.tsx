"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Category, Product } from "@/lib/types";

export default function HomeCategoryShowcase({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const tabs = useMemo(
    () => [
      { id: "featured", label: "Новинки" },
      ...categories.map((c) => ({ id: c.id, label: c.name, slug: c.slug })),
    ],
    [categories]
  );

  const [active, setActive] = useState(tabs[0]?.id ?? "featured");
  const scrollerRef = useRef<HTMLDivElement>(null);

  const activeProducts =
    active === "featured"
      ? products.filter((p) => p.is_featured)
      : products.filter((p) => p.category_id === active);

  const activeTab = tabs.find((t) => t.id === active);
  const activeSlug = activeTab && "slug" in activeTab ? activeTab.slug : undefined;

  function scroll(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  }

  return (
    <section className="container-page py-16 md:py-24">
      <div className="mb-8">
        <span className="eyebrow">Каталог</span>
        <h2 className="mt-2 font-display text-2xl text-ink md:text-3xl">Ассортимент</h2>
        <div className="stitch-line mt-5 w-16" />
      </div>

      {/* Вкладки — Новинки + каждый раздел каталога, объединено в один
          блок вместо двух отдельных секций. Переключение на клиенте,
          без перехода со страницы. */}
      <div className="mb-6 flex flex-wrap gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
              active === t.id
                ? "border-saddle-500 bg-saddle-500 text-parchment"
                : "border-saddle-200 text-leather-600 hover:bg-saddle-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeProducts.length === 0 ? (
        <div className="card border-dashed py-16 text-center">
          <p className="text-sm text-leather-500">В этом разделе пока нет товаров.</p>
        </div>
      ) : (
        <div className="relative">
          {activeProducts.length > 3 && (
            <>
              <button
                type="button"
                onClick={() => scroll(-1)}
                aria-label="Прокрутить назад"
                className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-saddle-200 bg-parchment shadow-sm hover:bg-saddle-50 md:flex"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                aria-label="Прокрутить вперёд"
                className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-saddle-200 bg-parchment shadow-sm hover:bg-saddle-50 md:flex"
              >
                →
              </button>
            </>
          )}

          <div
            ref={scrollerRef}
            className="flex snap-x gap-5 overflow-x-auto scroll-smooth pb-2"
          >
            {activeProducts.map((p) => (
              <div key={p.id} className="w-[calc(50%-0.625rem)] shrink-0 snap-start sm:w-56">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}

      <Link
        href={active === "featured" ? "/catalog" : `/catalog/${activeSlug ?? ""}`}
        className="btn-secondary mt-8 inline-flex"
      >
        {active === "featured" ? "Весь каталог" : `Все товары раздела «${activeTab?.label}»`}
      </Link>
    </section>
  );
}
