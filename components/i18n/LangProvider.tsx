"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LANG, LANG_COOKIE, getDictionary, type Dictionary, type Lang } from "@/lib/i18n/dictionaries";

type LangContextValue = {
  lang: Lang;
  dict: Dictionary;
  setLang: (lang: Lang) => void;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [lang, setLangState] = useState<Lang>(initialLang ?? DEFAULT_LANG);

  const setLang = useCallback(
    (next: Lang) => {
      // Кука — источник истины и для серверных компонентов (Header,
      // Footer, страницы каталога и т.д.), и для клиентских (через этот
      // контекст). Год хранения — обычный срок для предпочтения языка.
      document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000`;
      setLangState(next);
      // Обновляет серверные компоненты на текущей странице новым языком,
      // не теряя состояние клиентских (корзина и т.п. не сбрасываются).
      router.refresh();
    },
    [router]
  );

  return (
    <LangContext.Provider value={{ lang, dict: getDictionary(lang), setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error("useLang() must be used within <LangProvider>");
  }
  return ctx;
}
