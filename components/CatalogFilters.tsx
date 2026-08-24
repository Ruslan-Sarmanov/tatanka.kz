"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLang } from "@/components/i18n/LangProvider";

// Не используем .input-field здесь намеренно: этот класс задаёт
// width: 100% через @apply, и в скомпилированном CSS его правило
// физически оказывается ниже блока Tailwind-утилит (класс объявлен
// вне @layer components в globals.css) — из-за этого любые попытки
// сузить поле утилитой вроде w-40 не срабатывали. Свой компактный
// класс с тем же обликом, но без этой ловушки.
const controlClass =
  "h-9 rounded-sm border border-saddle-200 bg-card px-2.5 text-sm text-ink " +
  "focus:border-saddle-500 focus:outline-none focus:ring-1 focus:ring-saddle-500";

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
  const { dict } = useLang();

  const activeCategory = searchParams.get("category") ?? "";
  const activeMaterial = searchParams.get("material") ?? "";
  const activeColor = searchParams.get("color") ?? "";
  const activeGender = searchParams.get("gender") ?? "";

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
    <div className="mb-8 flex flex-wrap items-center gap-2">
      <select
        className={`${controlClass} w-auto max-w-[9.5rem]`}
        value={activeCategory}
        onChange={(e) => updateParam("category", e.target.value)}
      >
        <option value="">{dict.catalog.typeFilter}</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>{c.name}</option>
        ))}
      </select>

      <select
        className={`${controlClass} w-auto max-w-[8.5rem]`}
        value={activeGender}
        onChange={(e) => updateParam("gender", e.target.value)}
      >
        <option value="">{dict.catalog.genderFilter}</option>
        <option value="men">{dict.catalog.men}</option>
        <option value="women">{dict.catalog.women}</option>
        <option value="unisex">{dict.catalog.unisex}</option>
      </select>

      {materials.length > 0 && (
        <select
          className={`${controlClass} w-auto max-w-[9.5rem]`}
          value={activeMaterial}
          onChange={(e) => updateParam("material", e.target.value)}
        >
          <option value="">{dict.catalog.materialFilter}</option>
          {materials.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      )}

      {colors.length > 0 && (
        <select
          className={`${controlClass} w-auto max-w-[8rem]`}
          value={activeColor}
          onChange={(e) => updateParam("color", e.target.value)}
        >
          <option value="">{dict.catalog.colorFilter}</option>
          {colors.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}

      <div className="flex items-center gap-1">
        <input
          type="text"
          inputMode="numeric"
          placeholder={dict.catalog.from}
          className={`${controlClass} w-24`}
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value.replace(/[^0-9]/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && applyPriceRange()}
        />
        <span className="text-ink/30">—</span>
        <input
          type="text"
          inputMode="numeric"
          placeholder={dict.catalog.to}
          className={`${controlClass} w-20`}
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value.replace(/[^0-9]/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && applyPriceRange()}
        />
      </div>

      <button
        type="button"
        onClick={applyPriceRange}
        className="h-9 rounded-sm border border-saddle-300 px-3 text-sm font-medium text-ink transition hover:bg-saddle-100"
      >
        {dict.common.apply}
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
          {dict.common.reset}
        </button>
      )}
    </div>
  );
}
