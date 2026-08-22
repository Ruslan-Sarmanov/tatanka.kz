import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import HomeCategoryShowcase from "@/components/HomeCategoryShowcase";
import { getServerDictionary } from "@/lib/i18n/server";

export default async function HomePage() {
  const supabase = createClient();
  const t = getServerDictionary();

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TATANKA.KZ",
    url: "https://tatanka.kz",
    logo: "https://tatanka.kz/icons/icon-512.png",
    description:
      "Кожаные аксессуары ручной работы — кошельки, портмоне, сумки, картхолдеры, ключницы. Натуральная кожа растительного дубления, изготовление в Казахстане.",
    address: { "@type": "PostalAddress", addressCountry: "KZ" },
  };

  return (
    <div>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ---- Герой: тёмная кожа, крупная метка бизона, клеймо-заголовок ---- */}
      <section className="relative overflow-hidden bg-ink">
        <Image
          src="/brand/bison-mark-light.png"
          alt=""
          width={900}
          height={900}
          unoptimized
          className="pointer-events-none absolute -right-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 opacity-[0.07] md:h-[640px] md:w-[640px]"
          aria-hidden
        />
        <div className="container-page relative py-20 md:py-28">
          <div className="max-w-xl">
            <span className="eyebrow text-saddle-300">{t.home.heroEyebrow}</span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] text-parchment md:text-6xl">
              {t.home.heroTitleLine1}
              <br />
              {t.home.heroTitleLine2}
            </h1>
            <div className="stitch-line mt-6 w-24" style={{ ["--stitch-color" as any]: "#C99A66" }} />
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-parchment/65">
              {t.home.heroText}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/catalog" className="btn-primary">
                {t.home.viewCatalog}
              </Link>
              <a href="#brand" className="btn-ghost-light">
                {t.home.aboutBrand}
              </a>
            </div>
          </div>
        </div>
      </section>

      <HomeCategoryShowcase categories={categories ?? []} products={(products ?? []) as any} />

      {/* ---- О бренде ---- */}
      <section id="brand" className="relative overflow-hidden bg-ink">
        <div className="container-page grid gap-10 py-20 md:grid-cols-[auto_1fr] md:items-center md:py-28">
          <Image
            src="/brand/bison-mark-light.png"
            alt=""
            width={200}
            height={200}
            unoptimized
            className="h-24 w-24 opacity-90 md:h-40 md:w-40"
          />
          <div className="max-w-xl">
            <span className="eyebrow text-saddle-300">{t.home.approachEyebrow}</span>
            <h2 className="mt-3 font-display text-2xl leading-snug text-parchment md:text-3xl">
              {t.home.brandTitle}
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-parchment/60">
              {t.home.brandText}
            </p>
            <Link href="/catalog" className="btn-ghost-light mt-8 inline-flex">
              {t.home.viewItems}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
