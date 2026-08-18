import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import FavoriteButton from "@/components/FavoriteButton";
import QuickAddButton from "@/components/QuickAddButton";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0]?.url ?? null;

  return (
    <div className="card group relative block overflow-hidden">
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
              Фото скоро
            </div>
          )}
          {product.is_made_to_order && <span className="tag-order absolute left-3 top-3">Под заказ</span>}
        </div>
        <div className="p-4">
          <h3 className="text-[15px] font-medium text-ink">{product.name}</h3>
          <p className="mt-1.5 font-mono text-sm text-saddle-500">
            {product.price.toLocaleString("ru-RU")} ₸
          </p>
        </div>
      </Link>

      {/* Кнопки лежат поверх карточки как отдельные элементы (не внутри <Link>),
          чтобы клик по ним не проваливался в переход на страницу товара —
          вложенная кнопка внутри <a> невалидна и ведёт себя непредсказуемо. */}
      <div className="absolute right-3 top-3 flex flex-col gap-2">
        <FavoriteButton
          item={{ productId: product.id, slug: product.slug, name: product.name, price: product.price, image }}
        />
        <QuickAddButton
          item={{ productId: product.id, slug: product.slug, name: product.name, price: product.price, image }}
        />
      </div>
    </div>
  );
}
