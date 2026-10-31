// Уведомления владельцу магазина о новых заказах и сообщениях.
// Только серверный код — вызывается из API-роутов, ключи сюда не попадают в браузер.
//
// Каналы включаются сами, если заданы переменные окружения в Vercel:
//   Почта (Resend):  RESEND_API_KEY + ADMIN_NOTIFY_EMAIL  (+ NOTIFY_FROM_EMAIL, необязательно)
//   Telegram:        TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
// Если канал не настроен — он просто молча пропускается.
//
// Главное правило: сбой уведомления НИКОГДА не должен ломать заказ или
// отправку сообщения, поэтому наружу функция исключений не выбрасывает —
// ошибки только пишутся в логи Vercel.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tatanka.kz";
const TIMEOUT_MS = 4000;

async function sendEmail(subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  const from = process.env.NOTIFY_FROM_EMAIL || "TATANKA.KZ <hello@tatanka.kz>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      // можно указать несколько адресов через запятую
      to: to.split(",").map((s) => s.trim()).filter(Boolean),
      subject,
      // Только текст, без HTML — так имя клиента или текст сообщения
      // не могут «сломать» письмо или подсунуть в него чужую вёрстку.
      text,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // parse_mode не задаём — текст уходит как есть, без разметки
    body: JSON.stringify({ chat_id: chatId, text: text.slice(0, 3900) }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Telegram ${res.status}: ${await res.text()}`);
  }
}

export async function notifyAdmin(subject: string, body: string) {
  const link = `Открыть в админке: ${SITE_URL}/account?tab=admin`;
  const text = `${body}\n\n${link}`;

  const results = await Promise.allSettled([
    sendEmail(subject, text),
    sendTelegram(`${subject}\n\n${text}`),
  ]);

  for (const r of results) {
    if (r.status === "rejected") {
      console.error("[notifyAdmin] не удалось отправить уведомление:", r.reason);
    }
  }
}
