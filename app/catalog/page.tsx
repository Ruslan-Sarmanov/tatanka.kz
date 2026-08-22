import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import CatalogFilters from "@/components/CatalogFilters";

export const metadata: Metadata = {
  title: "Каталог",
  description:
    "Весь каталог кожаных изделий ручной работы TATANKA.KZ — кошельки, портмоне, сумки, картхолдеры, ключницы. Натуральная кожа, изготовление в Казахстане.",
  alternates: { canonical: "/catalog" },
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: {
    category?: string;
    material?: string;
    color?: string;
    gender?: string;
    priceMin?: string;
    priceMax?: string;
  };
}) {
  const supabase = createClient();

  const [{ data: categories }, { data: allActiveProducts }] = await Promise.all([
    supabase
      .from("categories")
      .select("id, slug, name")
      .order("sort_order", { ascending: true }),
    // Списки значений для фильтров собираем из реальных товаров, а не
    // захардкоженными — так фильтр всегда отражает то, что действительно
    // есть в каталоге, и не показывает пустые варианты.
    supabase
      .from("products")
      .select("material, color")
      .eq("is_active", true),
  ]);

  const materials = Array.from(
    new Set((allActiveProducts ?? []).map((p) => p.material).filter((v): v is string => !!v))
  ).sort();
  const colors = Array.from(
    new Set((allActiveProducts ?? []).map((p) => p.color).filter((v): v is string => !!v))
  ).sort();

  let query = supabase
    .from("products")
    .select("*, images:product_images(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (searchParams.category) {
    const category = (categories ?? []).find((c) => c.slug === searchParams.category);
    if (category) query = query.eq("category_id", category.id);
  }
  if (searchParams.material) query = query.eq("material", searchParams.material);
  if (searchParams.color) query = query.eq("color", searchParams.color);
  if (searchParams.gender) query = query.eq("gender", searchParams.gender);

  const priceMin = Number(searchParams.priceMin);
  const priceMax = Number(searchParams.priceMax);
  if (searchParams.priceMin && !Number.isNaN(priceMin)) query = query.gte("price", priceMin);
  if (searchParams.priceMax && !Number.isNaN(priceMax)) query = query.lte("price", priceMax);

  const { data: products } = await query;

  return (
    <div className="pb-16">
      <div className="container-page pt-8">
        <Link href="/" className="text-sm text-ink/60 transition hover:text-saddle-500">
          ← Главная
        </Link>
      </div>

      <div className="container-page mt-4">
        <span className="eyebrow">Каталог</span>
        <h1 className="mt-1.5 font-display text-3xl text-ink sm:text-4xl">Все изделия</h1>
        <div className="stitch-line mt-6 w-16" />
      </div>

      <div className="container-page mt-8">
        <CatalogFilters
          categories={(categories ?? []).map((c) => ({ slug: c.slug, name: c.name }))}
          materials={materials}
          colors={colors}
        />

        {!products || products.length === 0 ? (
          <div className="card border-dashed py-16 text-center">
            <p className="text-sm text-ink/50">По этому фильтру пока ничего не нашлось.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
            {products.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
