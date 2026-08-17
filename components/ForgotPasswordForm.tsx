"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Письмо ведёт на /auth/callback — там код из ссылки обменивается на
    // сессию, и только потом пользователь попадает на /reset-password.
    const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    setLoading(false);
    if (error) return setError(error.message);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="card mx-auto max-w-md space-y-3 p-6 text-center">
        <h1 className="font-display text-2xl text-ink">Проверьте почту</h1>
        <p className="text-sm text-ink/60">
          Если аккаунт с адресом <span className="font-medium text-ink">{email}</span> существует —
          мы отправили на него ссылку для восстановления пароля. Перейдите по ней, чтобы задать новый пароль.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card mx-auto max-w-md space-y-4 p-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Восстановление пароля</h1>
        <p className="mt-1 text-sm text-ink/60">Укажите email — пришлём ссылку для сброса пароля.</p>
      </div>

      <div>
        <label className="mb-1 block text-sm text-ink/70">Email</label>
        <input
          type="email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Отправляем…" : "Отправить ссылку"}
      </button>

      <p className="text-center text-sm text-ink/60">
        Вспомнили пароль? <a className="underline" href="/login">Войти</a>
      </p>
    </form>
  );
}
