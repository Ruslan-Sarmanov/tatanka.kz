"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import { useLang } from "@/components/i18n/LangProvider";

export default function CartPage() {
  const { items, remove, setQuantity, total } = useCartStore();
  const { dict } = useLang();

  if (items.length === 0) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="font-display text-2xl text-leather-800">{dict.cart.empty}</h1>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          {dict.cart.toCatalog}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page space-y-6 py-12">
      <h1 className="font-display text-3xl text-leather-800">{dict.cart.title}</h1>

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
                вылезала за пределы экрана на узких телефонах. */}
            <div className="min-w-0 flex-1">
              <Link href={`/product/${item.slug}`} className="font-medium hover:underline">
                {item.name}
              </Link>
              {item.customization && (
                <p className="text-sm text-leather-500">{dict.cart.customization}: {item.customization}</p>
              )}
              <p className="text-sm text-leather-600">{item.price.toLocaleString("ru-RU")} ₸</p>
            </div>
            <input
              type="number"
              min={1}
              className="input-field w-20 shrink-0"
              value={item.quantity}
              onChange={(e) => setQuantity(item.productId, Math.max(1, Number(e.target.value)))}
            />
            <button
              className="shrink-0 text-sm text-red-600 underline"
              onClick={() => remove(item.productId)}
            >
              {dict.cart.remove}
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xl font-semibold">{dict.cart.total}: {total().toLocaleString("ru-RU")} ₸</p>
        <Link href="/checkout" className="btn-primary">
          {dict.cart.checkout}
        </Link>
      </div>
    </div>
  );
}
