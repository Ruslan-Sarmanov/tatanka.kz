"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё\s-]/gi, "")
    .replace(/\s+/g, "-");
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.from("categories").insert({
      name,
      slug: slugify(name),
      sort_order: categories.length,
    });

    setLoading(false);
    if (error) return setError(error.message);
    setName("");
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить категорию?")) return;
    await supabase.from("categories").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="card flex gap-3 p-4">
        <input
          className="input-field"
          placeholder="Название категории"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button className="btn-primary shrink-0" disabled={loading}>
          Добавить
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="card divide-y divide-leather-100">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span>{c.name}</span>
            <span className="text-leather-400">/{c.slug}</span>
            <button className="text-red-600 underline" onClick={() => handleDelete(c.id)}>
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
