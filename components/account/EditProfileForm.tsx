"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/components/i18n/LangProvider";

export default function EditProfileForm({
  initial,
}: {
  initial: { full_name: string | null; phone: string | null };
}) {
  const router = useRouter();
  const supabase = createClient();
  const { dict } = useLang();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState(initial.full_name ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      setError("Не удалось определить пользователя");
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() || null, phone: phone.trim() || null })
      .eq("id", user.id);

    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 text-sm text-saddle-500 underline hover:text-saddle-600"
      >
        Изменить имя и телефон
      </button>
    );
  }

  return (
    <form onSubmit={handleSave} className="mt-4 space-y-3 border-t border-leather-100 pt-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-leather-500">{dict.account.name}</label>
          <input
            className="input-field"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-leather-500">{dict.account.phone}</label>
          <input
            className="input-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary text-sm">
          {loading ? "Сохраняем…" : "Сохранить"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn-secondary text-sm">
          Отмена
        </button>
      </div>
    </form>
  );
}
