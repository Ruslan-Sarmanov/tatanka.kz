"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Category } from "@/lib/types";

// "Сырые" строки — одна на позицию в заказе, с датой. Агрегация по товару
// считается уже здесь, на клиенте, ПОСЛЕ применения фильтра по датам —
// иначе фильтр по датам не мог бы работать (заранее посчитанные суммы
// не знали бы, из каких дат они сложены).
export type AnalyticsRow = {
  orderDate: string; // ISO, напр. "2026-08-20"
  productId: string;
  name: string;
  image: string | null;
  categorySlug: string | null;
  categoryName: string;
  price: number;
  qty: number;
  revenue: number;
};

type SortKey = "qty_desc" | "qty_asc" | "revenue_desc" | "revenue_asc" | "name_asc";
const PAGE_SIZE = 25;

export default function AnalyticsTab({
  rows,
  categories,
}: {
  rows: AnalyticsRow[];
  categories: Category[];
}) {
  const [category, setCategory] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("qty_desc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const aggregated = useMemo(() => {
    let source = rows;
    if (dateFrom) source = source.filter((r) => r.orderDate >= dateFrom);
    if (dateTo) source = source.filter((r) => r.orderDate <= dateTo);

    const byProduct = new Map<string, Omit<AnalyticsRow, "orderDate">>();
    for (const r of source) {
      const existing = byProduct.get(r.productId);
      if (existing) {
        existing.qty += r.qty;
        existing.revenue += r.revenue;
      } else {
        byProduct.set(r.productId, { ...r });
      }
    }
    return Array.from(byProduct.values());
  }, [rows, dateFrom, dateTo]);

  const filtered = useMemo(() => {
    let result = aggregated;
    if (category) result = result.filter((r) => r.categorySlug === category);
    const min = Number(priceMin);
    const max = Number(priceMax);
    if (priceMin && !Number.isNaN(min)) result = result.filter((r) => r.price >= min);
    if (priceMax && !Number.isNaN(max)) result = result.filter((r) => r.price <= max);

    const sorted = [...result];
    switch (sortKey) {
      case "qty_asc": sorted.sort((a, b) => a.qty - b.qty); break;
      case "revenue_desc": sorted.sort((a, b) => b.revenue - a.revenue); break;
      case "revenue_asc": sorted.sort((a, b) => a.revenue - b.revenue); break;
      case "name_asc": sorted.sort((a, b) => a.name.localeCompare(b.name, "ru")); break;
      default: sorted.sort((a, b) => b.qty - a.qty);
    }
    return sorted;
  }, [aggregated, category, priceMin, priceMax, sortKey]);

  const visible = filtered.slice(0, visibleCount);
  const hasFilters = category || priceMin || priceMax || dateFrom || dateTo;

  return (
    <div>
      <h3 className="mb-4 font-medium text-leather-800">
        Аналитика продаж <span className="font-normal text-leather-400">({filtered.length} товаров)</span>
      </h3>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs text-leather-500">Тип</label>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setVisibleCount(PAGE_SIZE); }}
            className="input-field"
            style={{ width: "10rem" }}
          >
            <option value="">Все типы</option>
            {categories.map((c: any) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-leather-500">Цена от</label>
          <input
            type="text"
            inputMode="numeric"
            value={priceMin}
            onChange={(e) => { setPriceMin(e.target.value.replace(/[^0-9]/g, "")); setVisibleCount(PAGE_SIZE); }}
            className="input-field"
            style={{ width: "6.5rem" }}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-leather-500">Цена до</label>
          <input
            type="text"
            inputMode="numeric"
            value={priceMax}
            onChange={(e) => { setPriceMax(e.target.value.replace(/[^0-9]/g, "")); setVisibleCount(PAGE_SIZE); }}
            className="input-field"
            style={{ width: "6.5rem" }}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-leather-500">Дата с</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setVisibleCount(PAGE_SIZE); }}
            className="input-field"
            style={{ width: "9.5rem" }}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-leather-500">по</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setVisibleCount(PAGE_SIZE); }}
            className="input-field"
            style={{ width: "9.5rem" }}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-leather-500">Сортировка</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="input-field"
            style={{ width: "12rem" }}
          >
            <option value="qty_desc">Продано: по убыванию</option>
            <option value="qty_asc">Продано: по возрастанию</option>
            <option value="revenue_desc">Выручка: по убыванию</option>
            <option value="revenue_asc">Выручка: по возрастанию</option>
            <option value="name_asc">По названию, А-Я</option>
          </select>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setCategory(""); setPriceMin(""); setPriceMax("");
              setDateFrom(""); setDateTo(""); setVisibleCount(PAGE_SIZE);
            }}
            className="text-sm text-leather-500 underline hover:text-leather-800"
          >
            Сбросить
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-sm border border-dashed border-leather-200 py-16 text-center">
          <p className="text-sm text-leather-500">
            Пока нет оплаченных продаж{hasFilters ? " по этому фильтру" : ""}.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-sm border border-leather-100">
            <table className="w-full text-sm">
              <thead className="border-b border-leather-100 bg-leather-50 text-left text-xs uppercase text-leather-500">
                <tr>
                  <th className="px-4 py-3">Товар</th>
                  <th className="px-4 py-3">Категория</th>
                  <th className="px-4 py-3">Цена</th>
                  <th className="px-4 py-3">Продано, шт</th>
                  <th className="px-4 py-3">Выручка</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-leather-100">
                {visible.map((r) => (
                  <tr key={r.productId}>
                    <td className="flex items-center gap-3 px-4 py-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-leather-100">
                        {r.image && <Image src={r.image} alt="" fill className="object-cover" unoptimized />}
                      </div>
                      <span className="font-medium">{r.name}</span>
                    </td>
                    <td className="px-4 py-3 text-leather-500">{r.categoryName}</td>
                    <td className="px-4 py-3">{r.price.toLocaleString("ru-RU")} ₸</td>
                    <td className="px-4 py-3 font-medium">{r.qty}</td>
                    <td className="px-4 py-3 font-medium">{r.revenue.toLocaleString("ru-RU")} ₸</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        </>
      )}
    </div>
  );
}
