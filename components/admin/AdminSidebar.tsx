import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const links = [
  { href: "/account/admin", label: "Дашборд" },
  { href: "/account/admin/products", label: "Товары" },
  { href: "/account/admin/categories", label: "Категории" },
  { href: "/account/admin/banners", label: "Баннеры" },
  { href: "/account/admin/orders", label: "Заказы" },
  { href: "/account/admin/analytics", label: "Аналитика" },
  { href: "/account/admin/finance", label: "Финансы" },
];

export default async function AdminSidebar() {
  const supabase = createClient();
  // "paid" — деньги получены, но заказ ещё не взят в работу. Раньше
  // здесь считались заказы со статусом "new", но при оформлении заказ
  // сразу создаётся как "awaiting_payment" — статус "new" в реальности
  // никогда не возникает, из-за чего счётчик всегда показывал 0. Как
  // только статус меняют на "in_production" и дальше, заказ считается
  // взятым в работу и пропадает из счётчика.
  const { count: newOrdersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "paid");

  return (
    <aside className="w-56 shrink-0 border-r border-leather-100 bg-white">
      <div className="px-6 py-5 font-display text-lg text-leather-800">Админка</div>
      <nav className="flex flex-col gap-1 px-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center justify-between rounded px-3 py-2 text-sm text-leather-700 hover:bg-leather-50"
          >
            <span>{l.label}</span>
            {l.href === "/account/admin/orders" && !!newOrdersCount && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
                {newOrdersCount}
              </span>
            )}
          </Link>
        ))}
        <Link href="/account" className="mt-4 rounded px-3 py-2 text-sm text-leather-500 hover:bg-leather-50">
          ← Личный кабинет
        </Link>
        <Link href="/" className="rounded px-3 py-2 text-sm text-leather-500 hover:bg-leather-50">
          На сайт
        </Link>
      </nav>
    </aside>
  );
}
