"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/types";

export default function AddToCartForm({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState("");
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url ?? null,
      quantity,
      customization: customization || undefined,
    });
    setAdded(true);
  }

  return (
    <div className="space-y-4">
      {product.is_made_to_order && (
        <div>
          <label className="mb-1 block text-sm text-leather-700">
            Пожелания к изделию (размер, цвет, гравировка)
          </label>
          <textarea
            className="input-field"
            rows={3}
            value={customization}
            onChange={(e) => setCustomization(e.target.value)}
            placeholder="Например: длина ремня 105 см, цвет тёмно-коричневый"
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="text-sm text-leather-700">Количество</label>
        <input
          type="number"
          min={1}
          className="input-field w-20"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
        />
      </div>

      <div className="flex gap-3">
        <button className="btn-primary" onClick={handleAdd}>
          Добавить в корзину
        </button>
        {added && (
          <button className="btn-secondary" onClick={() => router.push("/cart")}>
            Перейти в корзину
          </button>
        )}
      </div>
    </div>
  );
}
