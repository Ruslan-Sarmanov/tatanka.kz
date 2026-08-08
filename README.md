# TATANKA.KZ — интернет-магазин кожаных аксессуаров

Стек: **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase (Postgres, Auth, Storage) + Robokassa**, деплой на **Vercel**, репозиторий — **GitHub**. Аналогично тому, как был устроен crm.4auto.kz.

## Разделы

- Главная (`/`) — хиро, разделы, новинки
- Регистрация / вход (`/register`, `/login`) — Supabase Auth
- Личный кабинет (`/account`, `/account/orders`) — профиль, история заказов
- Каталог по видам аксессуаров (`/catalog/[category]`), карточка товара (`/product/[slug]`)
- Корзина (`/cart`)
- Оформление заказа (`/checkout`) → оплата (`/checkout/payment`) → Robokassa → `/checkout/success` / `/checkout/fail`
- Админ-панель (`/admin`) — товары, категории, заказы (доступ только role = admin)

## Быстрый старт

```bash
npm install
cp .env.example .env.local   # заполнить ключи Supabase и Robokassa
npm run dev
```

## Настройка Supabase

1. Создать проект на [supabase.com](https://supabase.com).
2. В **SQL Editor** выполнить `supabase/schema.sql`, затем (по желанию) `supabase/seed.sql` для тестовых данных.
3. В **Project Settings → API** скопировать `URL`, `anon key`, `service_role key` в `.env.local`.
4. Сделать первого администратора:
   ```sql
   update public.profiles set role = 'admin' where id = '<UUID пользователя из auth.users>';
   ```
   (Пользователь должен сначала зарегистрироваться через `/register`.)
5. Изображения товаров загружаются в Storage-бакет `products` (создаётся автоматически схемой), публичный URL файла указывается в форме товара в админке.

## Настройка Robokassa

1. Зарегистрировать магазин на [robokassa.kz](https://robokassa.kz), получить `MerchantLogin`, `Password#1`, `Password#2`.
2. Заполнить в `.env.local`: `ROBOKASSA_MERCHANT_LOGIN`, `ROBOKASSA_PASSWORD1`, `ROBOKASSA_PASSWORD2`, `ROBOKASSA_TEST_MODE=true` для тестового режима.
3. В личном кабинете Robokassa указать:
   - **ResultURL**: `https://tatanka.kz/api/robokassa/result` (метод POST) — подтверждение оплаты (webhook)
   - **SuccessURL**: `https://tatanka.kz/checkout/success` (метод GET)
   - **FailURL**: `https://tatanka.kz/checkout/fail` (метод GET)
4. Логика подписи и проверки — в `lib/robokassa.ts`. У заказа есть числовой `order_number` (используется как `InvId`), т.к. Robokassa требует целочисленный идентификатор счёта.

## Публикация в GitHub и деплой на Vercel

```bash
cd tatanka-kz
git init
git add .
git commit -m "Initial commit: tatanka.kz storefront"
git branch -M main
git remote add origin https://github.com/<ваш-аккаунт>/tatanka-kz.git
git push -u origin main
```

Затем на [vercel.com](https://vercel.com) → **Add New Project** → импортировать репозиторий `tatanka-kz` → указать переменные окружения из `.env.example` (Settings → Environment Variables) → Deploy.

## Структура проекта

```
app/                  — страницы (App Router)
  (auth)/login, register
  account/            — личный кабинет
  admin/              — админ-панель
  catalog/[category]  — разделы по видам аксессуаров
  product/[slug]      — карточка товара
  checkout/           — оформление и оплата заказа
  api/checkout        — создание заказа
  api/robokassa/init  — формирование ссылки на оплату
  api/robokassa/result— webhook подтверждения оплаты
components/           — переиспользуемые компоненты (в т.ч. components/admin)
lib/                  — supabase-клиенты, robokassa, cart-store, типы
supabase/schema.sql   — схема БД + RLS-политики
supabase/seed.sql     — тестовые данные
```

## Важно перед продакшеном

- Заменить `ROBOKASSA_TEST_MODE=false` и боевые пароли Robokassa.
- Настроить домен `tatanka.kz` в Vercel и обновить `NEXT_PUBLIC_SITE_URL`.
- Проверить RLS-политики в `supabase/schema.sql` перед продакшн-запуском.
- Добавить реальные фото товаров через Supabase Storage (бакет `products`).
