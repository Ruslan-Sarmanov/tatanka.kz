"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Category } from "@/lib/types";

export type AnalyticsRow = {
  productId: string;
  name: string;
  image: string | null;
  categorySlug: string | null;
  categoryName: string;
  price: number;
  qty: number;
  revenue: number;
};

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

  const filtered = useMemo(() => {
    let result = rows;
    if (category) result = result.filter((r) => r.categorySlug === category);
    const min = Number(priceMin);
    const max = Number(priceMax);
    if (priceMin && !Number.isNaN(min)) result = result.filter((r) => r.price >= min);
    if (priceMax && !Number.isNaN(max)) result = result.filter((r) => r.price <= max);
    return [...result].sort((a, b) => b.qty - a.qty);
  }, [rows, category, priceMin, priceMax]);

  return (
    <div>
      <h3 className="mb-4 font-medium text-leather-800">Аналитика продаж</h3>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs text-leather-500">Тип</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
            style={{ width: "12rem" }}
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
            onChange={(e) => setPriceMin(e.target.value.replace(/[^0-9]/g, ""))}
            className="input-field"
            style={{ width: "7rem" }}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-leather-500">Цена до</label>
          <input
            type="text"
            inputMode="numeric"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value.replace(/[^0-9]/g, ""))}
            className="input-field"
            style={{ width: "7rem" }}
          />
        </div>
        {(category || priceMin || priceMax) && (
          <button
            type="button"
            onClick={() => { setCategory(""); setPriceMin(""); setPriceMax(""); }}
            className="text-sm text-leather-500 underline hover:text-leather-800"
          >
            Сбросить
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-sm border border-dashed border-leather-200 py-16 text-center">
          <p className="text-sm text-leather-500">
            Пока нет оплаченных продаж{category || priceMin || priceMax ? " по этому фильтру" : ""}.
          </p>
        </div>
      ) : (
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
              {filtered.map((r) => (
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
      )}
    </div>
  );
}
