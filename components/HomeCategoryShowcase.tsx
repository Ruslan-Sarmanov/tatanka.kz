"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import type { Category, Product } from "@/lib/types";

export default function HomeCategoryShowcase({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const featuredThumb = products.find((p) => p.is_featured)?.images?.[0]?.url ?? null;

  const tabs = useMemo(
    () => [
      { id: "featured", label: "Новинки", image: featuredThumb },
      ...categories.map((c) => ({ id: c.id, label: c.name, slug: c.slug, image: c.image_url })),
    ],
    [categories, featuredThumb]
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

      {/* Вкладки-плитки с фото — как раньше выглядели разделы каталога на
          главной, только теперь они же и переключают показанные товары.
          Новинки + каждый раздел, объединено в один блок вместо двух
          отдельных секций. Переключение на клиенте, без перехода.
          Каждая вкладка — фиксированной ширины (w-20/w-24), поэтому
          подпись под фото не меняет ширину колонки при переключении —
          раньше из-за разной длины названий разделов вкладки "плясали". */}
      <div className="no-scrollbar mb-8 flex gap-4 overflow-x-auto pb-1">
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className="flex w-20 shrink-0 flex-col items-center gap-2 md:w-24"
            >
              <span
                className={`stitch-frame relative h-20 w-20 overflow-hidden rounded-sm bg-saddle-100 transition md:h-24 md:w-24 ${
                  isActive
                    ? "border-2 border-saddle-500"
                    : "border-2 border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                {t.image ? (
                  <Image src={t.image} alt={t.label} fill sizes="96px" className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full items-center justify-center bg-saddle-100" />
                )}
              </span>
              {/* Подпись — фиксированный размер шрифта и вес всегда
                  одинаковы (меняется только цвет), плюс полоска-индикатор
                  снизу у активного раздела — сразу видно, какой выбран. */}
              <span className="flex flex-col items-center gap-1">
                <span
                  className={`line-clamp-2 text-center text-xs font-medium leading-tight ${
                    isActive ? "text-saddle-600" : "text-leather-500"
                  }`}
                >
                  {t.label}
                </span>
                <span className={`h-0.5 w-6 rounded-full ${isActive ? "bg-saddle-500" : "bg-transparent"}`} />
              </span>
            </button>
          );
        })}
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
            className="no-scrollbar flex snap-x gap-5 overflow-x-auto scroll-smooth pb-2"
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
