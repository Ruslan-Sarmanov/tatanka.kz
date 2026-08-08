import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-leather-800">Новый товар</h1>
      <ProductForm categories={categories ?? []} />
    </div>
  );
}
