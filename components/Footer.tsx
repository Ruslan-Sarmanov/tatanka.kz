import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import InstallAppButton from "@/components/InstallAppButton";
import { getServerDictionary } from "@/lib/i18n/server";

export default async function Footer() {
  const supabase = createClient();
  const t = getServerDictionary();
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
            {t.footer.tagline}
          </p>
          <InstallAppButton className="mt-4 inline-flex items-center gap-2 rounded-sm border border-parchment/25 px-4 py-2 text-sm text-parchment/80 transition hover:border-parchment/50 hover:text-parchment" />
        </div>

        <div>
          <div className="eyebrow mb-4 text-saddle-300/80">{t.footer.catalog}</div>
          <nav className="flex flex-col gap-2.5 text-sm">
            {(categories ?? []).map((cat) => (
              <Link key={cat.slug} href={`/catalog/${cat.slug}`} className="transition hover:text-parchment">
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <div className="eyebrow mb-4 text-saddle-300/80">{t.footer.shop}</div>
          <nav className="flex flex-col gap-2.5 text-sm">
            <Link href="/account" className="transition hover:text-parchment">{t.footer.cabinet}</Link>
            <Link href="/cart" className="transition hover:text-parchment">{t.footer.cart}</Link>
            <a href="#brand" className="transition hover:text-parchment">{t.footer.about}</a>
            <Link href="/contact" className="transition hover:text-parchment">{t.footer.contact}</Link>
          </nav>
        </div>
      </div>

      <div className="stitch-line opacity-40" style={{ ["--stitch-color" as any]: "#54341B" }} />

      <div className="container-page flex flex-col gap-2 py-6 font-mono text-xs text-parchment/40 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} TATANKA.KZ</p>
        <p>{t.footer.madeToOrder} · {t.footer.country}</p>
      </div>
    </footer>
  );
}
