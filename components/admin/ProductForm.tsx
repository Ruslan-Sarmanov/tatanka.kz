"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category, Product } from "@/lib/types";

// Кириллица переводится в латиницу побуквенно — адрес страницы (slug)
// всегда должен быть чистой латиницей, иначе получаются ссылки вида
// /product/тест, которые ненадёжно работают в браузере и могут не
// находиться при поиске записи в базе.
const CYRILLIC_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .split("")
    .map((ch) => (ch in CYRILLIC_MAP ? CYRILLIC_MAP[ch] : ch))
    .join("")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? categories[0]?.id ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [isMadeToOrder, setIsMadeToOrder] = useState(product?.is_made_to_order ?? true);
  const [leadTimeDays, setLeadTimeDays] = useState(product?.lead_time_days ?? 14);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [images, setImages] = useState<string[]>(
    product?.images?.map((i) => i.url) ?? [""]
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name,
      slug: product?.slug ?? slugify(name),
      category_id: categoryId || null,
      description,
      price,
      is_made_to_order: isMadeToOrder,
      lead_time_days: leadTimeDays,
      is_active: isActive,
    };

    let productId = product?.id;

    if (product) {
      const { error } = await supabase.from("products").update(payload).eq("id", product.id);
      if (error) {
        setLoading(false);
        return setError(error.message);
      }
    } else {
      const { data, error } = await supabase.from("products").insert(payload).select().single();
      if (error || !data) {
        setLoading(false);
        return setError(error?.message ?? "Ошибка создания товара");
      }
      productId = data.id;
    }

    // Пересобираем список изображений
    await supabase.from("product_images").delete().eq("product_id", productId);
    const imageRows = images
      .filter((url) => url.trim())
      .map((url, i) => ({ product_id: productId, url, sort_order: i }));
    if (imageRows.length > 0) {
      await supabase.from("product_images").insert(imageRows);
    }

    setLoading(false);
    router.push("/admin/products");
    router.refresh();
  }

  async function handleDelete() {
    if (!product || !confirm("Удалить товар?")) return;
    await supabase.from("products").delete().eq("id", product.id);
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4 p-6">
      <div>
        <label className="mb-1 block text-sm text-leather-700">Название</label>
        <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <label className="mb-1 block text-sm text-leather-700">Категория</label>
        <select
          className="input-field"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm text-leather-700">Описание</label>
        <textarea
          className="input-field"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-leather-700">Цена, ₸</label>
        <input
          type="number"
          className="input-field"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          min={0}
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="madeToOrder"
          checked={isMadeToOrder}
          onChange={(e) => setIsMadeToOrder(e.target.checked)}
        />
        <label htmlFor="madeToOrder" className="text-sm text-leather-700">Изготовление под заказ</label>
      </div>

      {isMadeToOrder && (
        <div>
          <label className="mb-1 block text-sm text-leather-700">Срок изготовления, дней</label>
          <input
            type="number"
            className="input-field"
            value={leadTimeDays}
            onChange={(e) => setLeadTimeDays(Number(e.target.value))}
            min={1}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        <label htmlFor="isActive" className="text-sm text-leather-700">Показывать на сайте</label>
      </div>

      <div>
        <label className="mb-1 block text-sm text-leather-700">
          Ссылки на изображения (URL из Supabase Storage)
        </label>
        {images.map((url, i) => (
          <input
            key={i}
            className="input-field mb-2"
            value={url}
            placeholder="https://…supabase.co/storage/v1/object/public/products/…"
            onChange={(e) =>
              setImages((prev) => prev.map((u, idx) => (idx === i ? e.target.value : u)))
            }
          />
        ))}
        <button
          type="button"
          className="text-sm underline text-leather-700"
          onClick={() => setImages((prev) => [...prev, ""])}
        >
          + добавить ещё изображение
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Сохраняем…" : "Сохранить"}
        </button>
        {product && (
          <button type="button" className="btn-secondary text-red-600" onClick={handleDelete}>
            Удалить товар
          </button>
        )}
      </div>
    </form>
  );
}
