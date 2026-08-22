"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/types";

const LOW_STOCK_THRESHOLD = 2;
const PAGE_SIZE = 25;

function StockBadge({ qty }: { qty: number | null }) {
  if (qty === null) return <span className="text-leather-400">не отслеживается</span>;
  if (qty === 0) return <span className="font-medium text-red-600">0 шт</span>;
  if (qty <= LOW_STOCK_THRESHOLD) return <span className="font-medium text-amber-600">{qty} шт — мало</span>;
  return <span className="text-leather-700">{qty} шт</span>;
}

type StockFilter = "" | "in_stock" | "low" | "out" | "untracked";

export default function ProductsTab({
  products,
  categories,
}: {
  products: any[];
  categories: Category[];
}) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((p: any) => {
      if (query && !p.name.toLowerCase().includes(query)) return false;
      if (categoryId && p.category_id !== categoryId) return false;
      if (stockFilter) {
        const qty = p.stock_quantity;
        if (stockFilter === "untracked" && qty !== null) return false;
        if (stockFilter === "out" && qty !== 0) return false;
        if (stockFilter === "low" && !(qty !== null && qty > 0 && qty <= LOW_STOCK_THRESHOLD)) return false;
        if (stockFilter === "in_stock" && !(qty !== null && qty > LOW_STOCK_THRESHOLD)) return false;
      }
      return true;
    });
  }, [products, search, categoryId, stockFilter]);

  const visible = filtered.slice(0, visibleCount);
  const hasFilters = search || categoryId || stockFilter;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium text-leather-800">
          Товары <span className="font-normal text-leather-400">({filtered.length})</span>
        </h3>
        <Link href="/account/admin/products/new" className="btn-primary text-sm">
          Добавить товар
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Поиск по названию…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
          className="input-field"
          style={{ width: "16rem", maxWidth: "100%" }}
        />
        <select
          value={categoryId}
          onChange={(e) => { setCategoryId(e.target.value); setVisibleCount(PAGE_SIZE); }}
          className="input-field"
          style={{ width: "10rem", maxWidth: "100%" }}
        >
          <option value="">Все категории</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(e) => { setStockFilter(e.target.value as StockFilter); setVisibleCount(PAGE_SIZE); }}
          className="input-field"
          style={{ width: "11rem", maxWidth: "100%" }}
        >
          <option value="">Любой остаток</option>
          <option value="in_stock">В наличии</option>
          <option value="low">Заканчивается</option>
          <option value="out">Нет в наличии</option>
          <option value="untracked">Не отслеживается</option>
        </select>
        {hasFilters && (
          <button
            type="button"
            onClick={() => { setSearch(""); setCategoryId(""); setStockFilter(""); setVisibleCount(PAGE_SIZE); }}
            className="text-sm text-leather-500 underline hover:text-leather-800"
          >
            Сбросить
          </button>
        )}
      </div>

      <div className="divide-y divide-leather-100 rounded-sm border border-leather-100">
        {visible.map((p: any) => {
          const sortedImages = [...(p.images ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order);
          const thumb = sortedImages[0]?.url as string | undefined;

          return (
            <Link
              key={p.id}
              href={`/account/admin/products/${p.id}`}
              className="flex flex-wrap items-center gap-4 px-4 py-3 text-sm hover:bg-leather-50"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-leather-100">
                {thumb ? (
                  <Image src={thumb} alt="" fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full items-center justify-center text-[9px] uppercase text-leather-400">
                    Нет фото
                  </div>
                )}
              </div>
              <span className="min-w-0 flex-1 font-medium">{p.name}</span>
              <span className="shrink-0 text-leather-500">{p.category?.name ?? "—"}</span>
              <span className="shrink-0">{Number(p.price).toLocaleString("ru-RU")} ₸</span>
              <span className="w-28 shrink-0 text-right">
                <StockBadge qty={p.stock_quantity} />
              </span>
              <span className={`shrink-0 ${p.is_active ? "text-green-700" : "text-leather-400"}`}>
                {p.is_active ? "Активен" : "Скрыт"}
              </span>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-leather-500">
            {products.length === 0 ? "Товаров пока нет." : "По этому фильтру ничего не нашлось."}
          </p>
        )}
      </div>

      {visibleCount < filtered.length && (
        <button
          type="button"
          onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
          className="btn-secondary mt-4 w-full text-sm"
        >
          Показать ещё ({filtered.length - visibleCount})
        </button>
      )}
    </div>
  );
}
