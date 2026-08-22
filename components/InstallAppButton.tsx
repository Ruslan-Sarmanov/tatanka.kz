"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/i18n/LangProvider";

// Chrome/Edge/Android посылают это событие, когда сайт соответствует
// критериям PWA (манифест + иконки + https) и установку можно предложить
// напрямую. iOS Safari это событие не поддерживает вообще — для него
// показываем текстовую подсказку через "Поделиться → На экран Домой"
// вместо кнопки, так честнее, чем предлагать несуществующую кнопку.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallAppButton({ className = "" }: { className?: string }) {
  const { dict } = useLang();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const onInstalled = () => setInstalled(true);
    window.addEventListener("appinstalled", onInstalled);

    // Уже установлено и открыто как приложение (standalone) — прятать кнопку.
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }

    setIsIOS(/iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()));

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  if (deferredPrompt) {
    return (
      <button type="button" onClick={handleInstall} className={className}>
        {dict.install.button}
      </button>
    );
  }

  // iOS не даёт программно предложить установку — только подсказка. Не
  // используем className кнопки (рамка/паддинги button-стиля) — иначе
  // текст выглядел бы как кликабельная кнопка, хотя по нему нажимать
  // бесполезно, это просто инструкция.
  if (isIOS) {
    return (
      <p className="mt-4 max-w-xs text-xs leading-relaxed text-parchment/50">
        {dict.install.iosHint}
      </p>
    );
  }

  return null;
}
