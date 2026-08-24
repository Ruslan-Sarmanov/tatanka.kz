import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import PromoBanners from "@/components/PromoBanners";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", params.category)
    .single();

  if (!category) return {};

  const description =
    category.description ??
    `${category.name} из натуральной кожи ручной работы — купить в TATANKA.KZ, Казахстан.`;

  return {
    title: category.name,
    description,
    alternates: { canonical: `/catalog/${params.category}` },
    openGraph: { title: category.name, description },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const supabase = createClient();
  const t = getServerDictionary();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.category)
    .single();

  if (!category) notFound();

  const [{ data: products }, { data: banners }] = await Promise.all([
    supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("category_id", category.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  return (
    <div className="pb-16">
      <div className="container-page pt-8">
        <Link href="/" className="text-sm text-ink/60 transition hover:text-saddle-500">
          ← {t.common.home}
        </Link>
      </div>

      <div className="container-page mt-4">
        <span className="eyebrow">{t.catalog.eyebrow}</span>
        <h1 className="mt-1.5 font-display text-3xl text-ink sm:text-4xl">{category.name}</h1>
        {category.description && <p className="mt-2 max-w-xl text-ink/60">{category.description}</p>}
        <div className="stitch-line mt-6 w-16" />
      </div>

      {/* Баннер акций/скидок — тот же блок, что показывался бы на
          главной, теперь живёт в каждом разделе каталога вместо
          статичного фото раздела. */}
      <PromoBanners banners={banners ?? []} />

      <div className="container-page mt-10">
        {!products || products.length === 0 ? (
          <div className="card border-dashed py-16 text-center">
            <p className="text-sm text-ink/50">{t.catalog.categoryEmpty}</p>
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
