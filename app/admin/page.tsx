import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [{ count: productsCount }, { count: ordersCount }, { data: revenueRows }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("total").eq("status", "paid"),
    ]);

  const revenue = (revenueRows ?? []).reduce((sum, o: any) => sum + Number(o.total), 0);

  const cards = [
    { label: "Товары", value: productsCount ?? 0 },
    { label: "Заказы", value: ordersCount ?? 0 },
    { label: "Выручка (оплаченные)", value: `${revenue.toLocaleString("ru-RU")} ₸` },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-leather-800">Дашборд</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="card p-6">
            <p className="text-sm text-leather-500">{c.label}</p>
            <p className="mt-2 text-2xl font-semibold text-leather-900">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
