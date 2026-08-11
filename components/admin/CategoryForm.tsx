"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё\s-]/gi, "")
    .replace(/\s+/g, "-");
}

export default function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(category)); // при редактировании — не переписываем slug автоматом
  const [description, setDescription] = useState(category?.description ?? "");
  const [sortOrder, setSortOrder] = useState(category?.sort_order ?? 0);
  const [imageUrl, setImageUrl] = useState(category?.image_url ?? "");
  const [imagePreview, setImagePreview] = useState<string | null>(category?.image_url ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    setError(null);

    const ext = file.name.split(".").pop() || "jpg";
    const path = `categories/${Date.now()}-${slugify(name || "category")}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("products").upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

    if (uploadError) {
      setUploading(false);
      setError(`Не удалось загрузить фото: ${uploadError.message}`);
      return;
    }

    const { data: publicUrl } = supabase.storage.from("products").getPublicUrl(path);
    setImageUrl(publicUrl.publicUrl);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!slug.trim()) {
      setError("Укажите URL раздела (например, belts) — латиницей, без пробелов.");
      return;
    }

    setLoading(true);

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      image_url: imageUrl.trim() || null,
      sort_order: Number(sortOrder) || 0,
    };

    const { error: saveError } = category
      ? await supabase.from("categories").update(payload).eq("id", category.id)
      : await supabase.from("categories").insert(payload);

    setLoading(false);
    if (saveError) return setError(saveError.message);

    router.push("/admin/categories");
    router.refresh();
  }

  async function handleDelete() {
    if (!category) return;
    if (!confirm(`Удалить раздел «${category.name}»? Товары внутри не удаляются, но останутся без раздела.`)) return;
    await supabase.from("categories").delete().eq("id", category.id);
    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl space-y-5 p-6">
      <div>
        <label className="mb-1 block text-sm text-ink/70">Название раздела</label>
        <input
          className="input-field"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Например, Ремни"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-ink/70">
          URL раздела <span className="text-ink/40">(латиницей, без пробелов — то, что будет в адресе страницы)</span>
        </label>
        <div className="flex items-center gap-1.5 font-mono text-sm text-saddle-400">
          <span className="text-ink/30">/catalog/</span>
          <input
            className="input-field font-mono"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="belts"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-ink/70">Описание (необязательно)</label>
        <textarea
          className="input-field"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Короткое описание раздела — показывается на странице каталога"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-ink/70">Фото раздела</label>
        {imagePreview && (
          <div className="relative mb-3 h-40 w-40 overflow-hidden rounded-sm border border-saddle-100 bg-saddle-100">
            <Image src={imagePreview} alt="" fill className="object-cover" unoptimized />
          </div>
        )}
        <label className="btn-secondary inline-flex cursor-pointer">
          {uploading ? "Загружаем…" : imagePreview ? "Заменить фото" : "Загрузить фото"}
          <input type="file" accept="image/*" className="hidden" onChange={handleImagePick} disabled={uploading} />
        </label>
      </div>

      <div>
        <label className="mb-1 block text-sm text-ink/70">
          Порядок показа <span className="text-ink/40">(меньше число — выше в списке)</span>
        </label>
        <input
          type="number"
          className="input-field w-32"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={loading || uploading} className="btn-primary">
          {loading ? "Сохраняем…" : "Сохранить"}
        </button>
        {category && (
          <button type="button" className="btn-secondary text-red-600" onClick={handleDelete}>
            Удалить раздел
          </button>
        )}
      </div>
    </form>
  );
}
