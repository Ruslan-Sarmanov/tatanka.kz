import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!category) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">Редактировать раздел</h1>
      <CategoryForm category={category} />
    </div>
  );
}
