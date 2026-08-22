"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import MessagesThread from "@/components/MessagesThread";
import type { Message } from "@/lib/types";

type ProfileLookup = Record<string, { full_name: string | null }>;

export default function MessagesTab({
  messages,
  profiles,
}: {
  messages: Message[];
  profiles: ProfileLookup;
}) {
  const supabase = createClient();
  const router = useRouter();

  const conversations = useMemo(() => {
    const byUser = new Map<string, Message[]>();
    for (const m of messages) {
      const list = byUser.get(m.user_id) ?? [];
      list.push(m);
      byUser.set(m.user_id, list);
    }
    return Array.from(byUser.entries())
      .map(([userId, msgs]) => {
        const sorted = [...msgs].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        const last = sorted[sorted.length - 1];
        const unread = sorted.filter((m) => m.sender_role === "customer" && !m.read_by_admin).length;
        return {
          userId,
          name: profiles[userId]?.full_name || "Покупатель",
          messages: sorted,
          lastAt: last.created_at,
          lastBody: last.body,
          unread,
        };
      })
      .sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
  }, [messages, profiles]);

  const [selectedUserId, setSelectedUserId] = useState(conversations[0]?.userId ?? null);
  const selected = conversations.find((c) => c.userId === selectedUserId) ?? null;

  async function openConversation(userId: string) {
    setSelectedUserId(userId);
    const conv = conversations.find((c) => c.userId === userId);
    if (conv && conv.unread > 0) {
      await supabase
        .from("messages")
        .update({ read_by_admin: true })
        .eq("user_id", userId)
        .eq("sender_role", "customer")
        .eq("read_by_admin", false);
      router.refresh();
    }
  }

  async function handleSend(body: string) {
    if (!selectedUserId) return;
    await supabase.from("messages").insert({ user_id: selectedUserId, sender_role: "admin", body });
    router.refresh();
  }

  if (conversations.length === 0) {
    return (
      <div>
        <h3 className="mb-4 font-medium text-leather-800">Сообщения</h3>
        <div className="rounded-sm border border-dashed border-leather-200 py-16 text-center">
          <p className="text-sm text-leather-500">Пока никто не писал.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 font-medium text-leather-800">Сообщения</h3>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="max-h-[28rem] overflow-y-auto rounded-sm border border-leather-100 md:w-64 md:shrink-0">
          {conversations.map((c) => (
            <button
              key={c.userId}
              type="button"
              onClick={() => openConversation(c.userId)}
              className={`flex w-full flex-col items-start gap-0.5 border-b border-leather-100 px-3 py-2.5 text-left text-sm last:border-b-0 hover:bg-leather-50 ${
                c.userId === selectedUserId ? "bg-saddle-50" : ""
              }`}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="font-medium">{c.name}</span>
                {c.unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                    {c.unread}
                  </span>
                )}
              </div>
              <span className="line-clamp-1 text-xs text-leather-500">{c.lastBody}</span>
            </button>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          {selected ? (
            <MessagesThread
              messages={selected.messages}
              viewerRole="admin"
              onSend={handleSend}
              placeholder={`Ответить: ${selected.name}…`}
            />
          ) : (
            <p className="text-sm text-leather-500">Выберите переписку слева.</p>
          )}
        </div>
      </div>
    </div>
  );
}
