"use client";

import Link from "next/link";
import Image from "next/image";
import { useFavoritesStore } from "@/lib/favorites-store";
import { useCartStore } from "@/lib/cart-store";

export default function FavoritesPage() {
  const { items, remove } = useFavoritesStore();
  const addToCart = useCartStore((s) => s.add);

  if (items.length === 0) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="font-display text-2xl text-leather-800">В избранном пока пусто</h1>
        <p className="mt-2 text-leather-500">
          Нажмите на сердечко на карточке товара, чтобы сохранить его сюда.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          В каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page space-y-6 py-12">
      <h1 className="font-display text-3xl text-leather-800">Избранное</h1>

      <div className="card divide-y divide-leather-100">
        {items.map((item) => (
          <div key={item.productId} className="flex flex-wrap items-center gap-4 p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-leather-100">
              {item.image && (
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              )}
            </div>
            {/* min-w-0 — без этого длинное название не могло сжаться меньше
                своей "естественной" ширины в flex-строке, и вся строка
                вылезала за пределы экрана на узких телефонах (тот же баг,
                что был на странице корзины). */}
            <div className="min-w-0 flex-1">
              <Link href={`/product/${item.slug}`} className="font-medium hover:underline">
                {item.name}
              </Link>
              <p className="text-sm text-leather-600">{item.price.toLocaleString("ru-RU")} ₸</p>
            </div>
            <button
              className="btn-secondary shrink-0 text-sm"
              onClick={() =>
                addToCart({
                  productId: item.productId,
                  slug: item.slug,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  quantity: 1,
                })
              }
            >
              В корзину
            </button>
            <button
              className="shrink-0 text-sm text-red-600 underline"
              onClick={() => remove(item.productId)}
            >
              Убрать
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
