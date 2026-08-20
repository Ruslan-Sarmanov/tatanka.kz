import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { orderStatusLabel } from "@/lib/order-status";

export default async function OrdersPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/orders");

  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, total, created_at, order_items(id, product_name, quantity, product:products(images:product_images(url, sort_order)))"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container-page space-y-6 py-12">
      <h1 className="font-display text-3xl text-leather-800">Мои заказы</h1>

      {!orders || orders.length === 0 ? (
        <p className="text-leather-500">У вас пока нет заказов.</p>
      ) : (
        <div className="card divide-y divide-leather-100">
          {orders.map((o: any) => (
            <Link
              key={o.id}
              href={`/account/orders/${o.id}`}
              className="block px-6 py-4 text-sm hover:bg-leather-50"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Заказ №{o.order_number}</span>
                <span className="text-leather-500">
                  {new Date(o.created_at).toLocaleDateString("ru-RU")}
                </span>
                <span>{orderStatusLabel(o.status)}</span>
                <span className="font-medium">{Number(o.total).toLocaleString("ru-RU")} ₸</span>
              </div>

              {/* Превью содержимого — чтобы понять, что внутри, без
                  необходимости открывать заказ. */}
              <div className="mt-3 flex flex-wrap gap-3">
                {o.order_items.map((item: any) => {
                  const sortedImages = [...(item.product?.images ?? [])].sort(
                    (a: any, b: any) => a.sort_order - b.sort_order
                  );
                  const thumb = sortedImages[0]?.url as string | undefined;
                  return (
                    <div key={item.id} className="flex items-center gap-2">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-leather-100">
                        {thumb && <Image src={thumb} alt="" fill className="object-cover" unoptimized />}
                      </div>
                      <span className="text-leather-600">
                        {item.product_name}
                        {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
