import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Обновляет Supabase-сессию и защищает приватные разделы.
//
// Важно: проверка auth.getUser() — это сетевой запрос к серверу Supabase,
// и раньше он выполнялся безусловно на КАЖДОЙ странице сайта (главная,
// каталог, карточка товара и т.д.), хотя авторизация реально нужна только
// на /account, /checkout и /admin. Это добавляло лишний сетевой прыжок
// перед началом рендера практически любой страницы — отсюда и ощущение
// подвисания при переходах. Теперь путь проверяется первым (без сети),
// и запрос к Supabase уходит только туда, где он действительно нужен.
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPrivate = path.startsWith("/account") || path.startsWith("/checkout");
  const isAdmin = path.startsWith("/admin");

  if (!isPrivate && !isAdmin) {
    return NextResponse.next({ request: { headers: request.headers } });
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (isAdmin) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
