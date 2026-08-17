import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Точка входа для всех ссылок из писем Supabase Auth (сброс пароля,
// подтверждение регистрации, magic link). Supabase (PKCE-flow) кладёт
// одноразовый `code` в query-параметр редиректа — его нужно явно обменять
// на сессию через exchangeCodeForSession здесь, на сервере, чтобы браузер
// получил httpOnly cookies с сессией. Без этого шага код в URL никем не
// обрабатывается, и клиентская форма (например ResetPasswordForm) вечно
// ждёт сессию, которая никогда не появится.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Куда вернуть пользователя после обмена кода на сессию.
  // Для сброса пароля ForgotPasswordForm передаёт next=/reset-password.
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const url = new URL("/forgot-password", origin);
      url.searchParams.set("error", "expired");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
