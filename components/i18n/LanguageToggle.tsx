"use client";

import { useLang } from "@/components/i18n/LangProvider";

export default function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      aria-label="Выбор языка сайта"
      className="flex items-center overflow-hidden rounded-full border border-saddle-200 text-xs font-medium"
    >
      <button
        type="button"
        onClick={() => setLang("ru")}
        aria-pressed={lang === "ru"}
        className={`px-2 py-1 transition ${
          lang === "ru" ? "bg-saddle-500 text-parchment" : "text-leather-500 hover:bg-saddle-50"
        }`}
      >
        РУС
      </button>
      <button
        type="button"
        onClick={() => setLang("kk")}
        aria-pressed={lang === "kk"}
        className={`px-2 py-1 transition ${
          lang === "kk" ? "bg-saddle-500 text-parchment" : "text-leather-500 hover:bg-saddle-50"
        }`}
      >
        ҚАЗ
      </button>
    </div>
  );
}
