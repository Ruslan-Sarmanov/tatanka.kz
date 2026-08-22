"use client";

import { useState } from "react";
import type { Message } from "@/lib/types";

export default function MessagesThread({
  messages,
  viewerRole,
  onSend,
  placeholder = "Напишите сообщение…",
}: {
  messages: Message[];
  // "Мои" сообщения (bubble справа, цветной фон) — те, где sender_role
  // совпадает с ролью того, кто СЕЙЧАС смотрит переписку.
  viewerRole: "customer" | "admin";
  onSend: (body: string) => Promise<void>;
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setSending(true);
    await onSend(body);
    setText("");
    setSending(false);
  }

  return (
    <div className="flex h-[28rem] flex-col rounded-sm border border-leather-100">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-leather-400">Сообщений пока нет — напишите первым.</p>
        ) : (
          messages.map((m) => {
            const isMine = m.sender_role === viewerRole;
            return (
              <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-sm px-3 py-2 text-sm ${
                    isMine ? "bg-saddle-500 text-parchment" : "bg-leather-50 text-ink"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.body}</p>
                  <p className={`mt-1 text-[10px] ${isMine ? "text-parchment/70" : "text-leather-400"}`}>
                    {new Date(m.created_at).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" · "}
                    {m.sender_role === "admin" ? "Магазин" : "Покупатель"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSend} className="flex items-end gap-2 border-t border-leather-100 p-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          rows={1}
          placeholder={placeholder}
          className="input-field flex-1 resize-none"
        />
        <button type="submit" disabled={sending || !text.trim()} className="btn-primary shrink-0">
          {sending ? "…" : "Отправить"}
        </button>
      </form>
    </div>
  );
}
