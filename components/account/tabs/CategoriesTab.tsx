import Link from "next/link";
import type { Category } from "@/lib/types";

export default function CategoriesTab({ categories }: { categories: Category[] }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium text-leather-800">Категории</h3>
        <Link href="/account/admin/categories/new" className="btn-primary text-sm">
          Добавить раздел
        </Link>
      </div>

      <div className="divide-y divide-leather-100 rounded-sm border border-leather-100">
        {categories.map((c: any) => (
          <Link
            key={c.id}
            href={`/account/admin/categories/${c.id}`}
            className="flex items-center justify-between gap-4 px-4 py-3 text-sm hover:bg-leather-50"
          >
            <span className="font-medium">{c.name}</span>
            <span className="font-mono text-xs text-leather-400">/{c.slug}</span>
            <span className={c.image_url ? "text-green-700" : "text-leather-400"}>
              {c.image_url ? "Фото есть" : "Без фото"}
            </span>
          </Link>
        ))}
        {categories.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-leather-500">Разделов пока нет.</p>
        )}
      </div>
    </div>
  );
}
