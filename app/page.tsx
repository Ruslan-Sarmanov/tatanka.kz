import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import HomeCategoryShowcase from "@/components/HomeCategoryShowcase";

export default async function HomePage() {
  const supabase = createClient();

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
            <span className="eyebrow text-saddle-300">Ручная работа · Под заказ · Казахстан</span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] text-parchment md:text-6xl">
              Кожа, которая
              <br />
              служит десятилетиями
            </h1>
            <div className="stitch-line mt-6 w-24" style={{ ["--stitch-color" as any]: "#C99A66" }} />
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-parchment/65">
              TATANKA — кошельки, портмоне, сумки и другие аксессуары из натуральной кожи растительного
              дубления. Каждое изделие вырезано, прошито и собрано вручную под ваш заказ.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/catalog" className="btn-primary">
                Смотреть каталог
              </Link>
              <a href="#brand" className="btn-ghost-light">
                О бренде
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
            <span className="eyebrow text-saddle-300">Наш подход</span>
            <h2 className="mt-3 font-display text-2xl leading-snug text-parchment md:text-3xl">
              Татанка — древнее слово для бизона: сила, выносливость, материал, который веками
              служил людям.
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-parchment/60">
              Мы работаем с кожей растительного дубления небольшими партиями и по индивидуальным
              размерам. Никакого конвейера — каждое изделие проходит через руки одного мастера,
              от раскроя до финальной прошивки.
            </p>
            <Link href="/catalog" className="btn-ghost-light mt-8 inline-flex">
              Смотреть изделия
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
