import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CANCELABLE_ORDER_STATUSES } from "@/lib/order-status";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import CancelOrderButton from "@/components/CancelOrderButton";
import EditOrderDetailsForm from "@/components/EditOrderDetailsForm";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/account/orders/${params.id}`);

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*, product:products(images:product_images(url, sort_order)))")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!order) notFound();

  const canPayOrCancel = CANCELABLE_ORDER_STATUSES.includes(order.status);

  return (
    <div className="container-page space-y-6 py-12">
      <h1 className="font-display text-3xl text-leather-800">
        Заказ №{order.order_number}
      </h1>
      <p className="text-leather-600">
        Статус: <OrderStatusBadge status={order.status} />
      </p>

      {canPayOrCancel && (
        <div className="card flex flex-wrap items-center gap-4 border-amber-200 bg-amber-50 p-4">
          <p className="flex-1 text-sm text-amber-800">
            Оплата ещё не завершена. Можно продолжить оплату или отменить заказ.
          </p>
          <Link href={`/checkout/payment?order=${order.id}`} className="btn-primary text-sm">
            Продолжить оплату
          </Link>
          <CancelOrderButton orderId={order.id} />
        </div>
      )}

      <div className="card divide-y divide-leather-100">
        {order.order_items.map((item: any) => {
          const sortedImages = [...(item.product?.images ?? [])].sort(
            (a: any, b: any) => a.sort_order - b.sort_order
          );
          const thumb = sortedImages[0]?.url as string | undefined;
          return (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4 text-sm">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-leather-100">
                {thumb && <Image src={thumb} alt="" fill className="object-cover" unoptimized />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.product_name}</p>
                {item.customization && (
                  <p className="text-leather-500">Пожелания: {item.customization}</p>
                )}
              </div>
              <p>{item.quantity} × {Number(item.price).toLocaleString("ru-RU")} ₸</p>
            </div>
          );
        })}
      </div>

      <div className="card space-y-3 p-6 text-sm">
        <p className="mb-1"><span className="text-leather-500">Получатель:</span> {order.contact_name}, {order.contact_phone}</p>
        <p className="mb-1"><span className="text-leather-500">Доставка:</span> {order.delivery_city}, {order.delivery_address}</p>
        {order.comment && <p className="mb-1"><span className="text-leather-500">Комментарий:</span> {order.comment}</p>}
        <p className="mt-3 text-lg font-semibold">Итого: {Number(order.total).toLocaleString("ru-RU")} ₸</p>

        {canPayOrCancel && (
          <div className="pt-2">
            <EditOrderDetailsForm
              orderId={order.id}
              initial={{
                contact_name: order.contact_name,
                contact_phone: order.contact_phone,
                delivery_city: order.delivery_city,
                delivery_address: order.delivery_address,
                comment: order.comment,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
