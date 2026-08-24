import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddToCartForm from "@/components/AddToCartForm";
import ProductGallery from "@/components/ProductGallery";
import { getServerDictionary } from "@/lib/i18n/server";

async function getProduct(slug: string) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, images:product_images(*), category:categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return product;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};

  const image = [...(product.images ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.url;
  const description =
    product.description ??
    `${product.name} — натуральная кожа, ручная работа. ${product.price.toLocaleString("ru-RU")} ₸.`;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  const t = getServerDictionary();

  if (!product) notFound();

  const sortedImages = [...(product.images ?? [])].sort((a, b) => a.sort_order - b.sort_order);

  // Availability для JSON-LD: сделанное под заказ изделие — MadeToOrder,
  // явно нулевой отслеживаемый остаток — OutOfStock, иначе — InStock.
  const availability = product.is_made_to_order
    ? "https://schema.org/MadeToOrder"
    : product.stock_quantity === 0
    ? "https://schema.org/OutOfStock"
    : "https://schema.org/InStock";

  // Structured data — по этому Google строит расширенные сниппеты в
  // поиске (цена, наличие, рейтинг) прямо под ссылкой на товар.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: sortedImages.map((img) => img.url),
    sku: product.slug,
    brand: { "@type": "Brand", name: "TATANKA" },
    offers: {
      "@type": "Offer",
      url: `https://tatanka.kz/product/${product.slug}`,
      priceCurrency: "KZT",
      price: product.price,
      availability,
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <div className="container-page py-10 md:py-14">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {product.category && (
        <Link
          href={`/catalog/${product.category.slug}`}
          className="mb-6 inline-block text-sm text-ink/60 transition hover:text-saddle-500"
        >
          ← {product.category.name}
        </Link>
      )}

      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <ProductGallery images={sortedImages} productName={product.name} />

        <div>
          {product.category && <p className="eyebrow">{product.category.name}</p>}
          <h1 className="mt-2 font-display text-3xl text-ink md:text-4xl">{product.name}</h1>

          <div className="stitch-line my-5 w-16" />

          <p className="font-mono text-2xl font-semibold text-saddle-500">
            {product.price.toLocaleString("ru-RU")} ₸
          </p>

          {product.is_made_to_order && (
            <div className="tag-order mt-4">
              {t.product.madeToOrder} · {t.product.leadTimeDays(product.lead_time_days ?? 14)}
            </div>
          )}

          {product.description && (
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/70">{product.description}</p>
          )}

          {(product.material || product.color || product.gender) && (
            <dl className="mt-6 max-w-md divide-y divide-leather-100 border-y border-leather-100 text-sm">
              {product.material && (
                <div className="flex justify-between py-2">
                  <dt className="text-ink/50">{t.product.material}</dt>
                  <dd className="text-ink/80">{product.material}</dd>
                </div>
              )}
              {product.color && (
                <div className="flex justify-between py-2">
                  <dt className="text-ink/50">{t.product.color}</dt>
                  <dd className="text-ink/80">{product.color}</dd>
                </div>
              )}
              {product.gender && (
                <div className="flex justify-between py-2">
                  <dt className="text-ink/50">{t.product.forWhom}</dt>
                  <dd className="text-ink/80">
                    {
                      { men: t.catalog.men, women: t.catalog.women, unisex: t.catalog.unisex }[
                        product.gender as "men" | "women" | "unisex"
                      ]
                    }
                  </dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-8">
            <AddToCartForm product={product as any} />
          </div>
        </div>
      </div>
    </div>
  );
}
