"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/components/i18n/LangProvider";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();
  const { dict } = useLang();

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
      <h1 className="font-display text-2xl text-ink">
        {mode === "login" ? dict.auth.loginTitle : dict.auth.registerTitle}
      </h1>

      {mode === "register" && (
        <>
          <div>
            <label className="mb-1 block text-sm text-ink/70">{dict.auth.name}</label>
            <input
              className="input-field"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink/70">{dict.auth.phone}</label>
            <input
              className="input-field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={dict.auth.phonePlaceholder}
            />
          </div>
        </>
      )}

      <div>
        <label className="mb-1 block text-sm text-ink/70">{dict.auth.email}</label>
        <input
          type="email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm text-ink/70">{dict.auth.password}</label>
          {mode === "login" && (
            <a href="/forgot-password" className="text-xs text-saddle-500 underline">
              {dict.auth.forgotPassword}
            </a>
          )}
        </div>
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
        {loading ? dict.auth.pleaseWait : mode === "login" ? dict.auth.login : dict.auth.register}
      </button>

      <p className="text-center text-sm text-ink/60">
        {mode === "login" ? (
          <>{dict.auth.noAccount} <a className="underline" href="/register">{dict.auth.register}</a></>
        ) : (
          <>{dict.auth.haveAccount} <a className="underline" href="/login">{dict.auth.login}</a></>
        )}
      </p>
    </form>
  );
}
