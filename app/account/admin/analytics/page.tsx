import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { PAID_ORDER_STATUSES } from "@/lib/order-status";

type Row = {
  productId: string;
  name: string;
  image: string | null;
  categoryName: string;
  price: number;
  qty: number;
  revenue: number;
};

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: { category?: string; priceMin?: string; priceMax?: string };
}) {
  const supabase = createClient();

  const [{ data: categories }, { data: itemRows }] = await Promise.all([
    supabase.from("categories").select("id, slug, name").order("sort_order", { ascending: true }),
    // !inner на orders — чтобы фильтр по order.status реально ограничивал
    // выборку (иначе PostgREST сделает left join и вернёт все строки).
    supabase
      .from("order_items")
      .select(
        "quantity, price, product:products(id, name, price, category_id, images:product_images(url, sort_order), category:categories(name)), order:orders!inner(status)"
      )
      .in("order.status", PAID_ORDER_STATUSES),
  ]);

  // Группируем по товару — считаем суммарное количество и выручку.
  const byProduct = new Map<string, Row>();
  for (const item of (itemRows ?? []) as any[]) {
    const p = item.product;
    if (!p) continue; // товар мог быть удалён из каталога
    const existing = byProduct.get(p.id);
    const sortedImages = [...(p.images ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order);
    const image = sortedImages[0]?.url ?? null;
    const lineRevenue = Number(item.price) * item.quantity;

    if (existing) {
      existing.qty += item.quantity;
      existing.revenue += lineRevenue;
    } else {
      byProduct.set(p.id, {
        productId: p.id,
        name: p.name,
        image,
        categoryName: p.category?.name ?? "—",
        price: Number(p.price),
        qty: item.quantity,
        revenue: lineRevenue,
      });
    }
  }

  let rows = Array.from(byProduct.values());

  if (searchParams.category) {
    const cat = (categories ?? []).find((c) => c.slug === searchParams.category);
    if (cat) rows = rows.filter((r) => r.categoryName === cat.name);
  }
  const priceMin = Number(searchParams.priceMin);
  const priceMax = Number(searchParams.priceMax);
  if (searchParams.priceMin && !Number.isNaN(priceMin)) rows = rows.filter((r) => r.price >= priceMin);
  if (searchParams.priceMax && !Number.isNaN(priceMax)) rows = rows.filter((r) => r.price <= priceMax);

  rows.sort((a, b) => b.qty - a.qty);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-leather-800">Аналитика продаж</h1>

      {/* Обычная GET-форма: без JS, фильтры применяются через query-параметры URL. */}
      <form className="mb-6 flex flex-wrap items-end gap-3" method="GET">
        <div>
          <label className="mb-1 block text-xs text-leather-500">Тип</label>
          <select name="category" defaultValue={searchParams.category ?? ""} className="input-field" style={{ width: "12rem", maxWidth: "100%" }}>
            <option value="">Все типы</option>
            {(categories ?? []).map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-leather-500">Цена от</label>
          <input
            type="number"
            name="priceMin"
            defaultValue={searchParams.priceMin ?? ""}
            className="input-field"
            style={{ width: "7rem", maxWidth: "100%" }}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-leather-500">Цена до</label>
          <input
            type="number"
            name="priceMax"
            defaultValue={searchParams.priceMax ?? ""}
            className="input-field"
            style={{ width: "7rem", maxWidth: "100%" }}
          />
        </div>
        <button type="submit" className="btn-secondary">Применить</button>
      </form>

      {rows.length === 0 ? (
        <div className="card border-dashed py-16 text-center">
          <p className="text-sm text-leather-500">
            Пока нет оплаченных продаж{searchParams.category || searchParams.priceMin || searchParams.priceMax ? " по этому фильтру" : ""}.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-leather-100 bg-leather-50 text-left text-xs uppercase text-leather-500">
                <tr>
                  <th className="px-4 py-3">Товар</th>
                  <th className="px-4 py-3">Категория</th>
                  <th className="px-4 py-3">Цена</th>
                  <th className="px-4 py-3">Продано, шт</th>
                  <th className="px-4 py-3">Выручка</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-leather-100">
                {rows.map((r) => (
                  <tr key={r.productId}>
                    <td className="flex items-center gap-3 px-4 py-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-leather-100">
                        {r.image && <Image src={r.image} alt="" fill className="object-cover" unoptimized />}
                      </div>
                      <span className="font-medium">{r.name}</span>
                    </td>
                    <td className="px-4 py-3 text-leather-500">{r.categoryName}</td>
                    <td className="px-4 py-3">{r.price.toLocaleString("ru-RU")} ₸</td>
                    <td className="px-4 py-3 font-medium">{r.qty}</td>
                    <td className="px-4 py-3 font-medium">{r.revenue.toLocaleString("ru-RU")} ₸</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
