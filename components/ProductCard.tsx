import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import FavoriteButton from "@/components/FavoriteButton";
import QuickAddButton from "@/components/QuickAddButton";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0]?.url ?? null;
  const cartItem = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image,
  };

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
        <div className="p-4 pb-0">
          <h3 className="text-[15px] font-medium text-ink">{product.name}</h3>
          <p className="mt-1.5 font-mono text-sm text-saddle-500">
            {product.price.toLocaleString("ru-RU")} ₸
          </p>
        </div>
      </Link>

      {/* Кнопка "В корзину" — с подписью, а не просто иконка, чтобы
          назначение было понятно сразу, без догадок. Лежит вне <Link>,
          чтобы клик по ней не проваливался в переход на страницу товара. */}
      <div className="p-4 pt-3">
        <QuickAddButton item={cartItem} compact className="w-full" />
      </div>

      <FavoriteButton
        item={cartItem}
        className="absolute right-3 top-3"
      />
    </div>
  );
}
