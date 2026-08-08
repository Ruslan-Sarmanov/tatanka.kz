-- ============================================================
-- tatanka.kz — схема базы данных Supabase (Postgres)
-- Применить: Supabase Dashboard → SQL Editor → New query → вставить и выполнить
-- ============================================================

-- Расширения
create extension if not exists "pgcrypto";

-- ---------- profiles (профиль пользователя, роль) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- Автоматически создаём профиль при регистрации пользователя
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- categories (разделы: ремни, кошельки, сумки, чехлы...) ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  sort_order int not null default 0
);

-- ---------- products ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(12,2) not null default 0,
  is_made_to_order boolean not null default true,
  lead_time_days int default 14,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  sort_order int not null default 0
);

-- ---------- addresses ----------
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  city text not null,
  address_line text not null,
  postal_code text,
  is_default boolean not null default false
);

-- ---------- orders ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigserial unique not null, -- числовой номер для Robokassa InvId
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'new' check (
    status in ('new','awaiting_payment','paid','in_production','shipped','completed','cancelled')
  ),
  total numeric(12,2) not null default 0,
  contact_name text not null,
  contact_phone text not null,
  contact_email text not null,
  delivery_city text not null,
  delivery_address text not null,
  comment text,
  payment_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity int not null default 1,
  price numeric(12,2) not null,
  customization text
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- helper: проверка роли admin без рекурсии RLS
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- profiles: пользователь видит и редактирует свой профиль; админ видит все
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- categories: публичное чтение, изменение — только админ
create policy "categories_public_read" on public.categories
  for select using (true);
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- products: публично видны только активные, админ видит и правит всё
create policy "products_public_read" on public.products
  for select using (is_active = true or public.is_admin());
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

create policy "product_images_public_read" on public.product_images
  for select using (true);
create policy "product_images_admin_write" on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());

-- addresses: только владелец
create policy "addresses_owner" on public.addresses
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id);

-- orders: владелец видит свои, админ — все; создание — владелец или гость(user_id null через service role)
create policy "orders_select_own_or_admin" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());
create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id);
create policy "orders_admin_update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

create policy "order_items_select_own_or_admin" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );
create policy "order_items_insert_own" on public.order_items
  for insert with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- ============================================================
-- Storage: бакет для изображений товаров
-- ============================================================
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "product_images_public_read_storage" on storage.objects
  for select using (bucket_id = 'products');
create policy "product_images_admin_write_storage" on storage.objects
  for all using (bucket_id = 'products' and public.is_admin())
  with check (bucket_id = 'products' and public.is_admin());

-- ============================================================
-- Как сделать пользователя администратором:
-- update public.profiles set role = 'admin' where id = '<UUID пользователя из auth.users>';
-- ============================================================
