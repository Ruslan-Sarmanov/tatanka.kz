import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Категории</h1>
        <Link href="/admin/categories/new" className="btn-primary">
          Добавить раздел
        </Link>
      </div>

      <div className="card divide-y divide-saddle-100">
        {(categories ?? []).map((c) => (
          <Link
            key={c.id}
            href={`/admin/categories/${c.id}`}
            className="flex items-center justify-between gap-4 px-4 py-3 text-sm transition hover:bg-saddle-50"
          >
            <span className="font-medium text-ink">{c.name}</span>
            <span className="font-mono text-xs text-saddle-400">/{c.slug}</span>
            <span className={c.image_url ? "text-green-700" : "text-ink/30"}>
              {c.image_url ? "Фото есть" : "Без фото"}
            </span>
          </Link>
        ))}
        {(categories ?? []).length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-ink/50">Разделов пока нет.</p>
        )}
      </div>
    </div>
  );
}
