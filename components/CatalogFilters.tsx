"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CatalogFilters({
  categories,
  materials,
  colors,
}: {
  categories: { slug: string; name: string }[];
  materials: string[];
  colors: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";
  const activeMaterial = searchParams.get("material") ?? "";
  const activeColor = searchParams.get("color") ?? "";
  const activeGender = searchParams.get("gender") ?? "";

  // Цена — не применяем на каждое нажатие клавиши (это бы дёргало URL и
  // перезагружало список при каждой цифре), только по кнопке "Применить"
  // или Enter. Локальное состояние стартует со значений из URL.
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") ?? "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") ?? "");

  function buildParams() {
    return new URLSearchParams(searchParams.toString());
  }

  function updateParam(key: string, value: string) {
    const params = buildParams();
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/catalog?${params.toString()}`);
  }

  function applyPriceRange() {
    const params = buildParams();
    const min = priceMin.replace(/[^0-9]/g, "");
    const max = priceMax.replace(/[^0-9]/g, "");
    if (min) params.set("priceMin", min); else params.delete("priceMin");
    if (max) params.set("priceMax", max); else params.delete("priceMax");
    router.push(`/catalog?${params.toString()}`);
  }

  const hasFilters =
    activeCategory || activeMaterial || activeColor || activeGender ||
    searchParams.get("priceMin") || searchParams.get("priceMax");

  return (
    <div className="mb-8 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="input-field w-auto"
          value={activeCategory}
          onChange={(e) => updateParam("category", e.target.value)}
        >
          <option value="">Все типы</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>

        <select
          className="input-field w-auto"
          value={activeGender}
          onChange={(e) => updateParam("gender", e.target.value)}
        >
          <option value="">Для него/неё — любой</option>
          <option value="men">Для него</option>
          <option value="women">Для неё</option>
          <option value="unisex">Унисекс</option>
        </select>

        {materials.length > 0 && (
          <select
            className="input-field w-auto"
            value={activeMaterial}
            onChange={(e) => updateParam("material", e.target.value)}
          >
            <option value="">Любой материал</option>
            {materials.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        )}

        {colors.length > 0 && (
          <select
            className="input-field w-auto"
            value={activeColor}
            onChange={(e) => updateParam("color", e.target.value)}
          >
            <option value="">Любой цвет</option>
            {colors.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-ink/50">Цена, ₸:</span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="от"
          className="input-field w-24"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value.replace(/[^0-9]/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && applyPriceRange()}
        />
        <span className="text-ink/30">—</span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="до"
          className="input-field w-24"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value.replace(/[^0-9]/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && applyPriceRange()}
        />
        <button type="button" onClick={applyPriceRange} className="btn-secondary text-sm">
          Применить
        </button>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setPriceMin("");
              setPriceMax("");
              router.push("/catalog");
            }}
            className="text-sm text-ink/50 underline hover:text-ink"
          >
            Сбросить фильтры
          </button>
        )}
      </div>
    </div>
  );
}
