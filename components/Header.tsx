import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CartBadge from "@/components/CartBadge";

export default async function Header() {
  const supabase = createClient();

  const [{ data: categories }, { data: userData }] = await Promise.all([
    supabase
      .from("categories")
      .select("slug, name")
      .order("sort_order", { ascending: true }),
    supabase.auth.getUser(),
  ]);

  const user = userData?.user ?? null;

  return (
    <header className="border-b border-leather-100 bg-leather-50/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold tracking-wide text-leather-700">
          TATANKA<span className="text-leather-400">.KZ</span>
        </Link>

        <nav className="hidden gap-6 md:flex">
          {(categories ?? []).map((c) => (
            <Link
              key={c.slug}
              href={`/catalog/${c.slug}`}
              className="text-sm font-medium text-leather-700 hover:text-leather-500"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <CartBadge />
          {user ? (
            <Link href="/account" className="text-sm font-medium text-leather-800">
              Кабинет
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-medium text-leather-800">
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
