import { createClient } from "@/lib/supabase/server";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-leather-800">Категории</h1>
      <CategoryManager categories={categories ?? []} />
    </div>
  );
}
