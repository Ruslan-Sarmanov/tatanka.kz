import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notifyAdmin } from "@/lib/notify";

const MAX_LENGTH = 2000;
// Если покупатель шлёт сообщения одно за другим, письмо уходит только на
// первое — остальные владелец увидит в переписке. Защита от потока писем
// (в том числе от случайного или злонамеренного спама).
const NOTIFY_COOLDOWN_MS = 60_000;

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const body = typeof payload?.body === "string" ? payload.body.trim() : "";
  if (!body) {
    return NextResponse.json({ error: "Пустое сообщение" }, { status: 400 });
  }
  if (body.length > MAX_LENGTH) {
    return NextResponse.json({ error: "Сообщение слишком длинное" }, { status: 400 });
  }

  // Время предыдущего сообщения покупателя — читаем ДО вставки нового.
  const { data: last } = await supabase
    .from("messages")
    .select("created_at")
    .eq("user_id", user.id)
    .eq("sender_role", "customer")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Вставка идёт от имени самого пользователя, поэтому политики RLS
  // работают как раньше: писать можно только в свою переписку.
  const { data: message, error } = await supabase
    .from("messages")
    .insert({ user_id: user.id, sender_role: "customer", body })
    .select()
    .single();

  if (error || !message) {
    return NextResponse.json(
      { error: error?.message ?? "Не удалось отправить сообщение" },
      { status: 500 }
    );
  }

  const recentlyNotified =
    last && Date.now() - new Date(last.created_at).getTime() < NOTIFY_COOLDOWN_MS;

  if (!recentlyNotified) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle();

    const who = profile?.full_name || user.email || "Покупатель";
    await notifyAdmin(
      `Новое сообщение от ${who}`,
      [
        `От: ${who}`,
        `Email: ${user.email ?? "—"}`,
        profile?.phone ? `Телефон: ${profile.phone}` : null,
        "",
        body.length > 500 ? `${body.slice(0, 500)}…` : body,
      ]
        .filter((l) => l !== null)
        .join("\n")
    );
  }

  return NextResponse.json({ message });
}
