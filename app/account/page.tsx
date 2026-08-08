import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, role")
    .eq("id", user.id)
    .single();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="container-page space-y-8 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-leather-800">Личный кабинет</h1>
        <SignOutButton />
      </div>

      <div className="card p-6">
        <h2 className="mb-4 text-lg font-medium text-leather-800">Профиль</h2>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-leather-500">Имя</dt>
            <dd className="text-leather-900">{profile?.full_name || "—"}</dd>
          </div>
          <div>
            <dt className="text-leather-500">Телефон</dt>
            <dd className="text-leather-900">{profile?.phone || "—"}</dd>
          </div>
          <div>
            <dt className="text-leather-500">Email</dt>
            <dd className="text-leather-900">{user.email}</dd>
          </div>
        </dl>
        {profile?.role === "admin" && (
          <Link href="/admin" className="mt-4 inline-block text-sm underline text-leather-700">
            Перейти в панель администратора
          </Link>
        )}
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-leather-800">Последние заказы</h2>
          <Link href="/account/orders" className="text-sm underline text-leather-700">
            Все заказы
          </Link>
        </div>

        {!orders || orders.length === 0 ? (
          <p className="text-sm text-leather-500">У вас пока нет заказов.</p>
        ) : (
          <ul className="divide-y divide-leather-100">
            {orders.map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                <Link href={`/account/orders/${o.id}`} className="underline">
                  Заказ №{o.order_number}
                </Link>
                <span className="text-leather-500">{new Date(o.created_at).toLocaleDateString("ru-RU")}</span>
                <span>{o.status}</span>
                <span className="font-medium">{o.total.toLocaleString("ru-RU")} ₸</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
