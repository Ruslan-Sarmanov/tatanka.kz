import Link from "next/link";
import Image from "next/image";
import OrderStatusBadge from "@/components/OrderStatusBadge";

export default function OrdersTab({ orders }: { orders: any[] }) {
  return (
    <div>
      <h3 className="mb-4 font-medium text-leather-800">Заказы</h3>

      <div className="divide-y divide-leather-100 rounded-sm border border-leather-100">
        {orders.map((o: any) => (
          <Link
            key={o.id}
            href={`/account/admin/orders/${o.id}`}
            className="block px-4 py-3 text-sm hover:bg-leather-50"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-medium">№{o.order_number}</span>
              <span className="text-leather-600">{o.contact_name}</span>
              <span className="text-leather-500">
                {new Date(o.created_at).toLocaleDateString("ru-RU")}
              </span>
              <OrderStatusBadge status={o.status} />
              <span className="ml-auto font-medium">{Number(o.total).toLocaleString("ru-RU")} ₸</span>
            </div>

            <div className="mt-2 flex flex-wrap gap-3">
              {(o.order_items ?? []).map((item: any) => {
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
          </Link>
        ))}
        {orders.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-leather-500">Заказов пока нет.</p>
        )}
      </div>
    </div>
  );
}
