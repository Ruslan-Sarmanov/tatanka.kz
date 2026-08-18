"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

type UploadedImage = { url: string; uploading?: boolean };

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
  // Цена и срок изготовления хранятся как строки, а не числа. Раньше поле
  // было value={price} (число) — при пустом/нулевом значении React рисовал
  // в input "0", и при вводе цифры курсор оказывался ДО этого нуля
  // (браузерная особенность number-инпутов), из-за чего первый введённый
  // символ фактически дописывался позади "0" и терялся на вид, пока не
  // ввести второй. Строковое состояние с очисткой нулей решает это.
  const [priceStr, setPriceStr] = useState(product?.price != null ? String(product.price) : "");
  const [material, setMaterial] = useState(product?.material ?? "");
  const [color, setColor] = useState(product?.color ?? "");
  const [gender, setGender] = useState<"" | "men" | "women" | "unisex">(product?.gender ?? "");
  const [isMadeToOrder, setIsMadeToOrder] = useState(product?.is_made_to_order ?? true);
  const [leadTimeStr, setLeadTimeStr] = useState(
    product?.lead_time_days != null ? String(product.lead_time_days) : "14"
  );
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [images, setImages] = useState<UploadedImage[]>(
    product?.images?.map((i) => ({ url: i.url })) ?? []
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleDigitsChange(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      // Оставляем только цифры — так поле никогда не рисует навязанный "0",
      // и печатать можно сразу с первого нажатия.
      setter(e.target.value.replace(/[^0-9]/g, ""));
    };
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // разрешаем выбрать тот же файл повторно
    if (files.length === 0) return;

    const folder = product?.slug || slugify(name) || "misc";
    const placeholders: UploadedImage[] = files.map(() => ({ url: "", uploading: true }));
    setImages((prev) => [...prev, ...placeholders]);
    const startIndex = images.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const cleanName = file.name.replace(/[^a-zA-Z0-9.\-]/g, "_");
      const path = `${folder}/${Date.now()}-${cleanName}`;

      const { error: uploadError } = await supabase.storage.from("products").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (uploadError) {
        setError(`Не удалось загрузить ${file.name}: ${uploadError.message}`);
        setImages((prev) => prev.filter((_, idx) => idx !== startIndex + i));
        continue;
      }

      const { data: publicUrlData } = supabase.storage.from("products").getPublicUrl(path);
      setImages((prev) =>
        prev.map((img, idx) =>
          idx === startIndex + i ? { url: publicUrlData.publicUrl, uploading: false } : img
        )
      );
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (images.some((img) => img.uploading)) {
      setError("Дождитесь окончания загрузки фото");
      return;
    }

    setLoading(true);

    const payload = {
      name,
      slug: product?.slug ?? slugify(name),
      category_id: categoryId || null,
      description,
      price: Number(priceStr) || 0,
      material: material.trim() || null,
      color: color.trim() || null,
      gender: gender || null,
      is_made_to_order: isMadeToOrder,
      lead_time_days: isMadeToOrder ? Number(leadTimeStr) || 1 : null,
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
      .filter((img) => img.url.trim())
      .map((img, i) => ({ product_id: productId, url: img.url, sort_order: i }));
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
          type="text"
          inputMode="numeric"
          className="input-field"
          value={priceStr}
          onChange={handleDigitsChange(setPriceStr)}
          placeholder="0"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-leather-700">Материал</label>
          <input
            className="input-field"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="Например: кожа растительного дубления"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-leather-700">Цвет</label>
          <input
            className="input-field"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Например: тёмно-коричневый"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-leather-700">Для кого</label>
        <select
          className="input-field"
          value={gender}
          onChange={(e) => setGender(e.target.value as "" | "men" | "women" | "unisex")}
        >
          <option value="">Не указано</option>
          <option value="men">Для него</option>
          <option value="women">Для неё</option>
          <option value="unisex">Унисекс</option>
        </select>
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
            type="text"
            inputMode="numeric"
            className="input-field"
            value={leadTimeStr}
            onChange={handleDigitsChange(setLeadTimeStr)}
            placeholder="14"
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
        <label className="mb-1 block text-sm text-leather-700">Фотографии товара</label>

        {images.length > 0 && (
          <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded border border-leather-200 bg-leather-50">
                {img.uploading ? (
                  <div className="flex h-full items-center justify-center text-xs text-leather-400">
                    Загрузка…
                  </div>
                ) : (
                  <Image src={img.url} alt="" fill className="object-cover" unoptimized />
                )}
                {!img.uploading && (
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label="Удалить фото"
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <label className="btn-secondary inline-flex cursor-pointer items-center text-sm">
          + Загрузить фото
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        <p className="mt-1 text-xs text-leather-500">Можно выбрать сразу несколько файлов.</p>
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
