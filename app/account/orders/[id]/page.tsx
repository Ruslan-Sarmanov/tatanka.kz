import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABELS: Record<string, string> = {
  new: "Новый",
  awaiting_payment: "Ожидает оплаты",
  paid: "Оплачен",
  in_production: "В изготовлении",
  shipped: "Отправлен",
  completed: "Завершён",
  cancelled: "Отменён",
};

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/account/orders/${params.id}`);

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!order) notFound();

  return (
    <div className="container-page space-y-6 py-12">
      <h1 className="font-display text-3xl text-leather-800">
        Заказ №{order.order_number}
      </h1>
      <p className="text-leather-600">
        Статус: <span className="font-medium">{STATUS_LABELS[order.status] ?? order.status}</span>
      </p>

      <div className="card divide-y divide-leather-100">
        {order.order_items.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between px-6 py-4 text-sm">
            <div>
              <p className="font-medium">{item.product_name}</p>
              {item.customization && (
                <p className="text-leather-500">Пожелания: {item.customization}</p>
              )}
            </div>
            <p>{item.quantity} × {item.price.toLocaleString("ru-RU")} ₸</p>
          </div>
        ))}
      </div>

      <div className="card p-6 text-sm">
        <p className="mb-1"><span className="text-leather-500">Получатель:</span> {order.contact_name}, {order.contact_phone}</p>
        <p className="mb-1"><span className="text-leather-500">Доставка:</span> {order.delivery_city}, {order.delivery_address}</p>
        {order.comment && <p className="mb-1"><span className="text-leather-500">Комментарий:</span> {order.comment}</p>}
        <p className="mt-3 text-lg font-semibold">Итого: {order.total.toLocaleString("ru-RU")} ₸</p>
      </div>
    </div>
  );
}
