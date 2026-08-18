import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import PromoBanners from "@/components/PromoBanners";

export default async function HomePage() {
  const supabase = createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: products } = await supabase
    .from("products")
    .select("*, images:product_images(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (
    <div>
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

      <PromoBanners banners={banners ?? []} />

      {/* ---- Разделы каталога ---- */}
      <section className="container-page py-16 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Каталог</span>
            <h2 className="mt-2 font-display text-2xl text-ink md:text-3xl">Разделы</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-6">
          {(categories ?? []).map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog/${cat.slug}`}
              className="stitch-frame group relative aspect-square overflow-hidden rounded-sm bg-saddle-100"
            >
              {cat.image_url ? (
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-saddle-100" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-transparent" />
              <span className="absolute bottom-4 left-4 font-display text-base text-parchment md:text-lg">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---- Новинки ---- */}
      {products && products.length > 0 && (
        <section className="bg-card py-16 md:py-24">
          <div className="container-page">
            <div className="mb-10">
              <span className="eyebrow">Свежая партия</span>
              <h2 className="mt-2 font-display text-2xl text-ink md:text-3xl">Новинки</h2>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
              {products.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

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
