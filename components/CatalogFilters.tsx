"use client";

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

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/catalog?${params.toString()}`);
  }

  const activeCategory = searchParams.get("category") ?? "";
  const activeMaterial = searchParams.get("material") ?? "";
  const activeColor = searchParams.get("color") ?? "";
  const hasFilters = activeCategory || activeMaterial || activeColor;

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
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

      {hasFilters && (
        <button
          type="button"
          onClick={() => router.push("/catalog")}
          className="text-sm text-ink/50 underline hover:text-ink"
        >
          Сбросить фильтры
        </button>
      )}
    </div>
  );
}
