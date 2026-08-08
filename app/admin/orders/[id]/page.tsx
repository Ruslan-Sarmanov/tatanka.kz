import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OrderStatusForm from "@/components/admin/OrderStatusForm";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", params.id)
    .single();

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-leather-800">Заказ №{order.order_number}</h1>
        <OrderStatusForm orderId={order.id} status={order.status} />
      </div>

      <div className="card divide-y divide-leather-100">
        {order.order_items.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between px-6 py-4 text-sm">
            <div>
              <p className="font-medium">{item.product_name}</p>
              {item.customization && (
                <p className="text-leather-500">Пожелания: {item.customization}</p>
              )}
            </div>
            <p>{item.quantity} × {Number(item.price).toLocaleString("ru-RU")} ₸</p>
          </div>
        ))}
      </div>

      <div className="card p-6 text-sm">
        <p className="mb-1"><span className="text-leather-500">Контакт:</span> {order.contact_name}, {order.contact_phone}, {order.contact_email}</p>
        <p className="mb-1"><span className="text-leather-500">Доставка:</span> {order.delivery_city}, {order.delivery_address}</p>
        {order.comment && <p className="mb-1"><span className="text-leather-500">Комментарий:</span> {order.comment}</p>}
        {order.payment_id && <p className="mb-1"><span className="text-leather-500">ID платежа Robokassa:</span> {order.payment_id}</p>}
        <p className="mt-3 text-lg font-semibold">Итого: {Number(order.total).toLocaleString("ru-RU")} ₸</p>
      </div>
    </div>
  );
}
