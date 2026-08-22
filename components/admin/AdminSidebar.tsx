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
    <aside className="shrink-0 border-b border-leather-100 bg-white md:w-56 md:border-b-0 md:border-r">
      <div className="px-6 py-5 font-display text-lg text-leather-800">Админка</div>
      <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:pb-0">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex shrink-0 items-center justify-between gap-2 rounded px-3 py-2 text-sm text-leather-700 hover:bg-leather-50"
          >
            <span>{l.label}</span>
            {l.href === "/account/admin/orders" && !!newOrdersCount && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
                {newOrdersCount}
              </span>
            )}
          </Link>
        ))}
        <Link href="/account" className="shrink-0 rounded px-3 py-2 text-sm text-leather-500 hover:bg-leather-50 md:mt-4">
          ← Личный кабинет
        </Link>
        <Link href="/" className="shrink-0 rounded px-3 py-2 text-sm text-leather-500 hover:bg-leather-50">
          На сайт
        </Link>
      </nav>
    </aside>
  );
}
