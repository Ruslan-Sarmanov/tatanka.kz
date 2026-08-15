"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const supabase = createClient();
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Ссылка из письма содержит токен восстановления во фрагменте URL —
    // Supabase сам подхватывает его и превращает во временную сессию,
    // достаточную для смены пароля. Слушаем событие, чтобы показать
    // форму только когда эта сессия реально готова.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) return setError(error.message);
    setDone(true);
    setTimeout(() => {
      router.push("/account");
      router.refresh();
    }, 1500);
  }

  if (done) {
    return (
      <div className="card mx-auto max-w-md space-y-2 p-6 text-center">
        <h1 className="font-display text-2xl text-ink">Пароль изменён</h1>
        <p className="text-sm text-ink/60">Переносим вас в личный кабинет…</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="card mx-auto max-w-md space-y-2 p-6 text-center">
        <h1 className="font-display text-2xl text-ink">Проверяем ссылку…</h1>
        <p className="text-sm text-ink/60">
          Если страница долго не открывается — возможно, ссылка из письма устарела.{" "}
          <a href="/forgot-password" className="underline">
            Запросить новую
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card mx-auto max-w-md space-y-4 p-6">
      <h1 className="font-display text-2xl text-ink">Новый пароль</h1>

      <div>
        <label className="mb-1 block text-sm text-ink/70">Новый пароль</label>
        <input
          type="password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Сохраняем…" : "Сохранить пароль"}
      </button>
    </form>
  );
}
