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
    <div className="container-page space-y-6 py-12">
      <div>
        <h1 className="font-display text-3xl text-leather-800">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-leather-600">{category.description}</p>
        )}
      </div>

      {!products || products.length === 0 ? (
        <p className="text-leather-500">В этом разделе пока нет товаров.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
