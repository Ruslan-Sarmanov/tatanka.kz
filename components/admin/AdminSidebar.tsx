import Link from "next/link";

const links = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/categories", label: "Категории" },
  { href: "/admin/banners", label: "Баннеры" },
  { href: "/admin/orders", label: "Заказы" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-leather-100 bg-white">
      <div className="px-6 py-5 font-display text-lg text-leather-800">Админка</div>
      <nav className="flex flex-col gap-1 px-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded px-3 py-2 text-sm text-leather-700 hover:bg-leather-50"
          >
            {l.label}
          </Link>
        ))}
        <Link href="/" className="mt-4 rounded px-3 py-2 text-sm text-leather-500 hover:bg-leather-50">
          ← На сайт
        </Link>
      </nav>
    </aside>
  );
}
