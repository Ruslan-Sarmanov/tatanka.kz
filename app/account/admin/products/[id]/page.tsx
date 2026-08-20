import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: categories }, { data: product }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("id", params.id)
      .single(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-leather-800">Редактировать товар</h1>
      <ProductForm categories={categories ?? []} product={product as any} />
    </div>
  );
}
