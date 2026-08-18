import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddToCartForm from "@/components/AddToCartForm";
import ProductGallery from "@/components/ProductGallery";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, images:product_images(*), category:categories(*)")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const sortedImages = [...(product.images ?? [])].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="container-page py-10 md:py-14">
      {product.category && (
        <Link
          href={`/catalog/${product.category.slug}`}
          className="mb-6 inline-block text-sm text-ink/60 transition hover:text-saddle-500"
        >
          ← {product.category.name}
        </Link>
      )}

      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <ProductGallery images={sortedImages} productName={product.name} />

        <div>
          {product.category && <p className="eyebrow">{product.category.name}</p>}
          <h1 className="mt-2 font-display text-3xl text-ink md:text-4xl">{product.name}</h1>

          <div className="stitch-line my-5 w-16" />

          <p className="font-mono text-2xl font-semibold text-saddle-500">
            {product.price.toLocaleString("ru-RU")} ₸
          </p>

          {product.is_made_to_order && (
            <div className="tag-order mt-4">
              Под заказ · ~{product.lead_time_days ?? 14} дней
            </div>
          )}

          {product.description && (
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/70">{product.description}</p>
          )}

          {(product.material || product.color || product.gender) && (
            <dl className="mt-6 max-w-md divide-y divide-leather-100 border-y border-leather-100 text-sm">
              {product.material && (
                <div className="flex justify-between py-2">
                  <dt className="text-ink/50">Материал</dt>
                  <dd className="text-ink/80">{product.material}</dd>
                </div>
              )}
              {product.color && (
                <div className="flex justify-between py-2">
                  <dt className="text-ink/50">Цвет</dt>
                  <dd className="text-ink/80">{product.color}</dd>
                </div>
              )}
              {product.gender && (
                <div className="flex justify-between py-2">
                  <dt className="text-ink/50">Для кого</dt>
                  <dd className="text-ink/80">
                    {
                      { men: "Для него", women: "Для неё", unisex: "Унисекс" }[
                        product.gender as "men" | "women" | "unisex"
                      ]
                    }
                  </dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-8">
            <AddToCartForm product={product as any} />
          </div>
        </div>
      </div>
    </div>
  );
}
