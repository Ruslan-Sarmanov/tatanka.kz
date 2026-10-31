"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import MessagesThread from "@/components/MessagesThread";
import type { Message } from "@/lib/types";

export default function FeedbackTab({ initialMessages }: { initialMessages: Message[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);

  // Открытие вкладки = компонент смонтировался (он рендерится только пока
  // активна вкладка "Обратная связь") — подходящий момент пометить ответы
  // магазина прочитанными и снять счётчик непрочитанных с вкладки.
  useEffect(() => {
    const hasUnread = initialMessages.some((m) => m.sender_role === "admin" && !m.read_by_customer);
    if (!hasUnread) return;

    supabase
      .from("messages")
      .update({ read_by_customer: true })
      .eq("sender_role", "admin")
      .eq("read_by_customer", false)
      .then(() => router.refresh());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Сообщение уходит через серверный маршрут: он и сохраняет его в базу,
  // и отправляет владельцу уведомление на почту/в Telegram.
  async function handleSend(body: string) {
    const res = await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (!res.ok) return;

    const { message } = await res.json();
    if (message) {
      setMessages((prev) => [...prev, message as Message]);
      router.refresh();
    }
  }

  return (
    <div className="card p-6">
      <h2 className="mb-1 text-lg font-medium text-leather-800">Обратная связь</h2>
      <p className="mb-4 text-sm text-leather-500">
        Есть вопрос по заказу или изделию? Напишите нам — отвечаем обычно в течение дня.
      </p>
      <MessagesThread messages={messages} viewerRole="customer" onSend={handleSend} />
    </div>
  );
}
