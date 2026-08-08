import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";

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

  return (
    <div>
      <section className="bg-leather-100">
        <div className="container-page grid gap-8 py-16 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="font-display text-4xl leading-tight text-leather-900 md:text-5xl">
              Кожаные аксессуары ручной работы под заказ
            </h1>
            <p className="mt-4 text-leather-700">
              TATANKA.KZ — ремни, кошельки, сумки и другие изделия из натуральной кожи.
              Каждое изделие изготавливается индивидуально под ваш заказ.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/catalog/belts" className="btn-primary">Смотреть каталог</Link>
              <a href="#brand" className="btn-secondary">О бренде</a>
            </div>
          </div>
          <div className="aspect-video rounded-lg bg-leather-200" />
        </div>
      </section>

      <section className="container-page py-12">
        <h2 className="mb-6 font-display text-2xl text-leather-800">Разделы</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {(categories ?? []).map((c) => (
            <Link
              key={c.slug}
              href={`/catalog/${c.slug}`}
              className="card group relative aspect-square overflow-hidden"
            >
              {c.image_url ? (
                <Image
                  src={c.image_url}
                  alt={c.name}
                  fill
                  className="object-cover transition group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-leather-100" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
              <span className="absolute bottom-3 left-3 font-medium text-white">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page py-12">
        <h2 className="mb-6 font-display text-2xl text-leather-800">Новинки</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {(products ?? []).map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section id="brand" className="bg-leather-100">
        <div className="container-page py-16 text-center">
          <h2 className="font-display text-2xl text-leather-800">О бренде</h2>
          <p className="mx-auto mt-4 max-w-2xl text-leather-700">
            Мы создаём аксессуары из натуральной кожи вручную — небольшими партиями
            и на заказ, с вниманием к каждой детали.
          </p>
        </div>
      </section>
    </div>
  );
}
