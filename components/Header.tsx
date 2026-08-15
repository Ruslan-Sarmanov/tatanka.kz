import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import CartBadge from "@/components/CartBadge";
import MobileNav from "@/components/MobileNav";
import CatalogMenu from "@/components/CatalogMenu";

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
  const cats = categories ?? [];

  return (
    <header className="sticky top-0 z-40 border-b border-saddle-100 bg-parchment/95 backdrop-blur">
      <div className="container-page relative flex h-20 items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <MobileNav categories={cats} />
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image
              src="/brand/bison-mark-dark.png"
              alt="TATANKA.KZ"
              width={40}
              height={40}
              unoptimized
              className="h-9 w-9 md:h-10 md:w-10"
              priority
            />
            <span className="font-display text-lg font-semibold tracking-wideish text-ink md:text-xl">
              TATANKA<span className="text-saddle-400">.KZ</span>
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-7 lg:flex">
          <CatalogMenu categories={cats} />
        </nav>

        <div className="flex items-center gap-5">
          <CartBadge />
          {user ? (
            <Link
              href="/account"
              className="hidden text-sm font-medium text-ink transition hover:text-saddle-500 sm:inline"
            >
              Кабинет
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden text-sm font-medium text-ink transition hover:text-saddle-500 sm:inline"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
      <div className="stitch-line" />
    </header>
  );
}
