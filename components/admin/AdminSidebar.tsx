import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const links = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/categories", label: "Категории" },
  { href: "/admin/banners", label: "Баннеры" },
  { href: "/admin/orders", label: "Заказы" },
  { href: "/admin/analytics", label: "Аналитика" },
  { href: "/admin/finance", label: "Финансы" },
];

export default async function AdminSidebar() {
  const supabase = createClient();
  // Заказы со статусом "new" — те, что ещё не открывали/не начали
  // обрабатывать. Как только статус меняют в карточке заказа, счётчик
  // сам уменьшается — отдельного поля "прочитано" не потребовалось.
  const { count: newOrdersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

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
            {l.href === "/admin/orders" && !!newOrdersCount && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
                {newOrdersCount}
              </span>
            )}
          </Link>
        ))}
        <Link href="/" className="mt-4 rounded px-3 py-2 text-sm text-leather-500 hover:bg-leather-50">
          ← На сайт
        </Link>
      </nav>
    </aside>
  );
}
