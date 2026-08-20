import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { orderStatusLabel } from "@/lib/order-status";

export default async function AdminOrdersPage() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, status, total, contact_name, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-leather-800">Заказы</h1>

      <div className="card divide-y divide-leather-100">
        {(orders ?? []).map((o) => (
          <Link
            key={o.id}
            href={`/admin/orders/${o.id}`}
            className="flex items-center justify-between px-4 py-3 text-sm hover:bg-leather-50"
          >
            <span className="font-medium">№{o.order_number}</span>
            <span>{o.contact_name}</span>
            <span className="text-leather-500">
              {new Date(o.created_at).toLocaleDateString("ru-RU")}
            </span>
            <span>{orderStatusLabel(o.status)}</span>
            <span className="font-medium">{Number(o.total).toLocaleString("ru-RU")} ₸</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
