import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddToCartForm from "@/components/AddToCartForm";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, images:product_images(*), category:categories(*)")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const image = product.images?.[0]?.url;

  return (
    <div className="container-page grid gap-10 py-12 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-leather-100">
        {image ? (
          <Image src={image} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-leather-300">Фото скоро</div>
        )}
      </div>

      <div>
        {product.category && (
          <p className="text-sm text-leather-500">{product.category.name}</p>
        )}
        <h1 className="mt-1 font-display text-3xl text-leather-900">{product.name}</h1>
        <p className="mt-3 text-2xl font-semibold text-leather-800">
          {product.price.toLocaleString("ru-RU")} ₸
        </p>

        {product.is_made_to_order && (
          <p className="mt-2 text-sm text-leather-600">
            Изготовление под заказ, срок ~{product.lead_time_days ?? 14} дней
          </p>
        )}

        {product.description && (
          <p className="mt-4 text-leather-700">{product.description}</p>
        )}

        <div className="mt-6">
          <AddToCartForm product={product as any} />
        </div>
      </div>
    </div>
  );
}
