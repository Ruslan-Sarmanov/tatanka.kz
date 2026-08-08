"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, phone } },
      });
      setLoading(false);
      if (error) return setError(error.message);
      router.push("/account");
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    router.push(params.get("next") ?? "/account");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card mx-auto max-w-md space-y-4 p-6">
      <h1 className="font-display text-2xl text-leather-800">
        {mode === "login" ? "Вход в кабинет" : "Регистрация"}
      </h1>

      {mode === "register" && (
        <>
          <div>
            <label className="mb-1 block text-sm text-leather-700">Имя</label>
            <input
              className="input-field"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-leather-700">Телефон</label>
            <input
              className="input-field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 7__ ___ __ __"
            />
          </div>
        </>
      )}

      <div>
        <label className="mb-1 block text-sm text-leather-700">Email</label>
        <input
          type="email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-leather-700">Пароль</label>
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
        {loading ? "Подождите…" : mode === "login" ? "Войти" : "Зарегистрироваться"}
      </button>

      <p className="text-center text-sm text-leather-600">
        {mode === "login" ? (
          <>Нет аккаунта? <a className="underline" href="/register">Зарегистрироваться</a></>
        ) : (
          <>Уже есть аккаунт? <a className="underline" href="/login">Войти</a></>
        )}
      </p>
    </form>
  );
}
