"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Banner } from "@/lib/types";

export default function BannerForm({ banner }: { banner?: Banner }) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(banner?.title ?? "");
  const [linkUrl, setLinkUrl] = useState(banner?.link_url ?? "");
  const [imageUrl, setImageUrl] = useState(banner?.image_url ?? "");
  const [imagePreview, setImagePreview] = useState<string | null>(banner?.image_url ?? null);
  const [sortOrderStr, setSortOrderStr] = useState(banner?.sort_order != null ? String(banner.sort_order) : "0");
  const [isActive, setIsActive] = useState(banner?.is_active ?? true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    setError(null);

    // Баннеры складываем в тот же бакет products, отдельной подпапкой —
    // тот же подход, что и у фото разделов каталога.
    const ext = file.name.split(".").pop() || "jpg";
    const path = `banners/${Date.now()}.${ext}`;

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

    if (!imageUrl.trim()) {
      setError("Загрузите изображение баннера");
      return;
    }
    if (!linkUrl.trim()) {
      setError("Укажите ссылку — куда попадёт клиент по клику на баннер");
      return;
    }

    setLoading(true);

    const payload = {
      title: title.trim() || null,
      image_url: imageUrl.trim(),
      link_url: linkUrl.trim(),
      sort_order: Number(sortOrderStr) || 0,
      is_active: isActive,
    };

    const { error: saveError } = banner
      ? await supabase.from("banners").update(payload).eq("id", banner.id)
      : await supabase.from("banners").insert(payload);

    setLoading(false);
    if (saveError) return setError(saveError.message);

    router.push("/admin/banners");
    router.refresh();
  }

  async function handleDelete() {
    if (!banner || !confirm("Удалить баннер?")) return;
    await supabase.from("banners").delete().eq("id", banner.id);
    router.push("/admin/banners");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl space-y-5 p-6">
      <div>
        <label className="mb-1 block text-sm text-leather-700">
          Название <span className="text-ink/40">(только для себя, на сайте не показывается)</span>
        </label>
        <input
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Например: Скидка 20% на кошельки"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-leather-700">Изображение баннера</label>
        {imagePreview && (
          <div className="relative mb-3 h-32 w-full max-w-md overflow-hidden rounded-sm border border-leather-200 bg-leather-50">
            <Image src={imagePreview} alt="" fill className="object-cover" unoptimized />
          </div>
        )}
        <label className="btn-secondary inline-flex cursor-pointer">
          {uploading ? "Загружаем…" : imagePreview ? "Заменить изображение" : "Загрузить изображение"}
          <input type="file" accept="image/*" className="hidden" onChange={handleImagePick} disabled={uploading} />
        </label>
        <p className="mt-1 text-xs text-leather-500">
          Рекомендуемое соотношение сторон — широкое, как баннер на главной (например 1600×500).
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm text-leather-700">
          Ссылка при клике <span className="text-ink/40">(куда попадёт клиент)</span>
        </label>
        <input
          className="input-field"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="/product/kartholder-buffalo или /catalog?category=koshelki"
          required
        />
        <p className="mt-1 text-xs text-leather-500">
          Можно указать путь на самом сайте (начиная с /) — например, страницу конкретного товара
          или отфильтрованный каталог — либо полный внешний адрес https://…
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm text-leather-700">
          Порядок показа <span className="text-ink/40">(меньше число — выше/раньше)</span>
        </label>
        <input
          type="text"
          inputMode="numeric"
          className="input-field w-32"
          value={sortOrderStr}
          onChange={(e) => setSortOrderStr(e.target.value.replace(/[^0-9]/g, ""))}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="bannerActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        <label htmlFor="bannerActive" className="text-sm text-leather-700">
          Показывать на сайте
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={loading || uploading} className="btn-primary">
          {loading ? "Сохраняем…" : "Сохранить"}
        </button>
        {banner && (
          <button type="button" className="btn-secondary text-red-600" onClick={handleDelete}>
            Удалить баннер
          </button>
        )}
      </div>
    </form>
  );
}
