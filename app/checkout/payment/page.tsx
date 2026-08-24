import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServerDictionary } from "@/lib/i18n/server";

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderId = searchParams.order;
  if (!orderId) notFound();

  const supabase = createClient();
  const t = getServerDictionary();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/checkout/payment?order=${orderId}`);

  const { data: order } = await supabase
    .from("orders")
    .select("id, order_number, total, status, contact_email")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (!order) notFound();

  return (
    <div className="container-page py-16 text-center">
      <h1 className="font-display text-3xl text-leather-800">{t.checkout.payTitle}</h1>
      <p className="mt-4 text-leather-600">
        {t.checkout.orderSum(String(order.order_number))}{" "}
        <span className="font-semibold">{order.total.toLocaleString("ru-RU")} ₸</span>
      </p>

      {order.status === "paid" ? (
        <p className="mt-6 text-green-700">{t.checkout.alreadyPaid}</p>
      ) : (
        <a href={`/api/robokassa/init?order=${order.id}`} className="btn-primary mt-8 inline-flex">
          {t.checkout.payButton}
        </a>
      )}
    </div>
  );
}
