import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function OrdersPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/orders");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container-page space-y-6 py-12">
      <h1 className="font-display text-3xl text-leather-800">Мои заказы</h1>

      {!orders || orders.length === 0 ? (
        <p className="text-leather-500">У вас пока нет заказов.</p>
      ) : (
        <div className="card divide-y divide-leather-100">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/account/orders/${o.id}`}
              className="flex items-center justify-between px-6 py-4 text-sm hover:bg-leather-50"
            >
              <span className="font-medium">Заказ №{o.order_number}</span>
              <span className="text-leather-500">
                {new Date(o.created_at).toLocaleDateString("ru-RU")}
              </span>
              <span>{o.status}</span>
              <span className="font-medium">{o.total.toLocaleString("ru-RU")} ₸</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
