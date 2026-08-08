import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, is_active, category:categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-leather-800">Товары</h1>
        <Link href="/admin/products/new" className="btn-primary">
          Добавить товар
        </Link>
      </div>

      <div className="card divide-y divide-leather-100">
        {(products ?? []).map((p: any) => (
          <Link
            key={p.id}
            href={`/admin/products/${p.id}`}
            className="flex items-center justify-between px-4 py-3 text-sm hover:bg-leather-50"
          >
            <span className="font-medium">{p.name}</span>
            <span className="text-leather-500">{p.category?.name ?? "—"}</span>
            <span>{Number(p.price).toLocaleString("ru-RU")} ₸</span>
            <span className={p.is_active ? "text-green-700" : "text-leather-400"}>
              {p.is_active ? "Активен" : "Скрыт"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
