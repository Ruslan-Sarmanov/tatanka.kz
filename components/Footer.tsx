import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function Footer() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, name")
    .order("sort_order", { ascending: true })
    .limit(4);

  return (
    <footer className="mt-24 bg-ink text-parchment/70">
      <div className="stitch-line" style={{ ["--stitch-color" as any]: "#54341B" }} />
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image src="/brand/bison-mark-light.png" alt="TATANKA.KZ" width={36} height={36} unoptimized className="h-9 w-9" />
            <span className="font-display text-lg font-semibold tracking-wideish text-parchment">
              TATANKA<span className="text-saddle-300">.KZ</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-parchment/55">
            Аксессуары из натуральной кожи, изготовленные вручную, небольшими партиями и на заказ.
          </p>
        </div>

        <div>
          <div className="eyebrow mb-4 text-saddle-300/80">Каталог</div>
          <nav className="flex flex-col gap-2.5 text-sm">
            {(categories ?? []).map((cat) => (
              <Link key={cat.slug} href={`/catalog/${cat.slug}`} className="transition hover:text-parchment">
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <div className="eyebrow mb-4 text-saddle-300/80">Магазин</div>
          <nav className="flex flex-col gap-2.5 text-sm">
            <Link href="/account" className="transition hover:text-parchment">Личный кабинет</Link>
            <Link href="/cart" className="transition hover:text-parchment">Корзина</Link>
            <a href="#brand" className="transition hover:text-parchment">О бренде</a>
          </nav>
        </div>
      </div>

      <div className="stitch-line opacity-40" style={{ ["--stitch-color" as any]: "#54341B" }} />

      <div className="container-page flex flex-col gap-2 py-6 font-mono text-xs text-parchment/40 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} TATANKA.KZ</p>
        <p>Изготовление под заказ · Казахстан</p>
      </div>
    </footer>
  );
}
