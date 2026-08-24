"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import FavoriteButton from "@/components/FavoriteButton";
import QuickAddButton from "@/components/QuickAddButton";
import { useLang } from "@/components/i18n/LangProvider";

export default function ProductCard({ product }: { product: Product }) {
  const { dict } = useLang();
  const image = product.images?.[0]?.url ?? null;
  const cartItem = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image,
  };

  return (
    <div className="card group relative overflow-hidden">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-saddle-100">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-wide text-saddle-400">
              {dict.product.photoSoon}
            </div>
          )}
          {product.is_made_to_order && <span className="tag-order absolute left-3 top-3">{dict.product.madeToOrder}</span>}
        </div>
        <div className="p-4 pb-3">
          {/* min-h + line-clamp-2 — название держит одинаковую высоту у
              всех карточек, даже если у одного товара оно в одну строку,
              а у другого — в две. Без этого цена/кнопка съезжали по
              высоте от карточки к карточке в одном ряду. */}
          <h3 className="line-clamp-2 min-h-[2.6em] text-[15px] font-medium leading-tight text-ink">
            {product.name}
          </h3>
        </div>
      </Link>

      {/* Цена и кнопка. На узких карточках (мобильный 2-колоночный грид —
          там на каждую карточку остаётся всего ~155px) цена и кнопка
          физически не помещаются в одну строку и текст кнопки обрезался
          за край карточки. Поэтому по умолчанию — друг под другом на всю
          ширину, и только от sm-экрана, где карточки становятся шире,
          встают рядом через justify-between. Этот блок — не внутри
          <Link>, чтобы клик по кнопке не проваливался в переход на
          страницу товара. */}
      <div className="flex flex-col gap-2 px-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="whitespace-nowrap font-mono text-sm text-saddle-500">
          {product.price.toLocaleString("ru-RU")} ₸
        </p>
        <QuickAddButton item={cartItem} compact className="w-full sm:w-auto sm:shrink-0" />
      </div>

      <FavoriteButton item={cartItem} className="absolute right-3 top-3" />
    </div>
  );
}
