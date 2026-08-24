"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { useLang } from "@/components/i18n/LangProvider";
import type { Product } from "@/lib/types";

export default function AddToCartForm({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const router = useRouter();
  const { dict } = useLang();
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
    <div className="space-y-5">
      {product.is_made_to_order && (
        <div>
          <label className="mb-1.5 block text-sm text-ink/70">
            {dict.product.customizationFullLabel}
          </label>
          <textarea
            className="input-field"
            rows={3}
            value={customization}
            onChange={(e) => setCustomization(e.target.value)}
            placeholder={dict.product.customizationPlaceholder}
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="text-sm text-ink/70">{dict.product.quantity}</label>
        <div className="flex items-center rounded-sm border border-saddle-200 bg-card">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center text-ink/60 transition hover:text-saddle-500"
            aria-label={dict.product.decreaseQty}
          >
            −
          </button>
          <span className="w-8 text-center font-mono text-sm text-ink">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-9 w-9 items-center justify-center text-ink/60 transition hover:text-saddle-500"
            aria-label={dict.product.increaseQty}
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" onClick={handleAdd}>
          {dict.product.addToCartFull}
        </button>
        {added && (
          <button className="btn-secondary" onClick={() => router.push("/cart")}>
            {dict.product.goToCart}
          </button>
        )}
      </div>
    </div>
  );
}
