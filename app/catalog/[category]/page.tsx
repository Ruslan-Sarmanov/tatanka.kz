import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const supabase = createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.category)
    .single();

  if (!category) notFound();

  const { data: products } = await supabase
    .from("products")
    .select("*, images:product_images(*)")
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="pb-16">
      <div className="container-page pt-8">
        <Link href="/" className="text-sm text-ink/60 transition hover:text-saddle-500">
          ← Главная
        </Link>
      </div>

      <div className="container-page mt-4">
        {category.image_url ? (
          <div className="stitch-frame relative h-56 w-full overflow-hidden rounded-sm sm:h-72">
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <span className="eyebrow text-saddle-300">Каталог</span>
              <h1 className="mt-1.5 font-display text-3xl text-parchment sm:text-4xl">{category.name}</h1>
              {category.description && (
                <p className="mt-2 max-w-xl text-sm text-parchment/75">{category.description}</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <span className="eyebrow">Каталог</span>
            <h1 className="mt-1.5 font-display text-3xl text-ink sm:text-4xl">{category.name}</h1>
            {category.description && <p className="mt-2 max-w-xl text-ink/60">{category.description}</p>}
            <div className="stitch-line mt-6 w-16" />
          </div>
        )}
      </div>

      <div className="container-page mt-10">
        {!products || products.length === 0 ? (
          <div className="card border-dashed py-16 text-center">
            <p className="text-sm text-ink/50">В этом разделе пока нет товаров — загляните позже.</p>
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
