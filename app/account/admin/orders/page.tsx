import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import DeleteOrderButton from "@/components/admin/DeleteOrderButton";

export default async function AdminOrdersPage() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, total, contact_name, created_at, order_items(id, product_name, quantity, product:products(images:product_images(url, sort_order)))"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-leather-800">Заказы</h1>

      <div className="card divide-y divide-leather-100">
        {(orders ?? []).map((o: any) => (
          <div key={o.id} className="relative px-4 py-3 text-sm hover:bg-leather-50">
            <Link
              href={`/account/admin/orders/${o.id}`}
              className="absolute inset-0 z-0"
              aria-label={`Заказ №${o.order_number}`}
            />
            <div className="relative z-10 flex flex-wrap items-center gap-3">
              <span className="font-medium">№{o.order_number}</span>
              <span className="text-leather-600">{o.contact_name}</span>
              <span className="text-leather-500">
                {new Date(o.created_at).toLocaleDateString("ru-RU")}
              </span>
              <OrderStatusBadge status={o.status} />
              <span className="ml-auto font-medium">{Number(o.total).toLocaleString("ru-RU")} ₸</span>
              <DeleteOrderButton orderId={o.id} orderNumber={o.order_number} />
            </div>

            <div className="relative z-10 mt-2 flex flex-wrap gap-3">
              {o.order_items.map((item: any) => {
                const sortedImages = [...(item.product?.images ?? [])].sort(
                  (a: any, b: any) => a.sort_order - b.sort_order
                );
                const thumb = sortedImages[0]?.url as string | undefined;
                return (
                  <div key={item.id} className="flex items-center gap-2">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded bg-leather-100">
                      {thumb && <Image src={thumb} alt="" fill className="object-cover" unoptimized />}
                    </div>
                    <span className="text-leather-500">
                      {item.product_name}
                      {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {(orders ?? []).length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-leather-500">Заказов пока нет.</p>
        )}
      </div>
    </div>
  );
}
