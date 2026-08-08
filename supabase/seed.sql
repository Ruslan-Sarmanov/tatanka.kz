-- Тестовые данные для tatanka.kz — выполнить после schema.sql

insert into public.categories (slug, name, description, sort_order) values
  ('belts', 'Ремни', 'Кожаные ремни ручной работы под заказ', 1),
  ('wallets', 'Кошельки', 'Кошельки и портмоне из натуральной кожи', 2),
  ('bags', 'Сумки', 'Сумки и рюкзаки ручной работы', 3),
  ('phone-cases', 'Чехлы для телефонов', 'Индивидуальные кожаные чехлы', 4),
  ('bracelets', 'Браслеты', 'Кожаные браслеты и аксессуары', 5)
on conflict (slug) do nothing;

insert into public.products (slug, category_id, name, description, price, is_made_to_order, lead_time_days)
select 'classic-belt-1', id, 'Ремень «Классик»', 'Ручная работа, растительное дубление, под заказ по размеру.', 18000, true, 10
from public.categories where slug = 'belts'
on conflict (slug) do nothing;

insert into public.products (slug, category_id, name, description, price, is_made_to_order, lead_time_days)
select 'bifold-wallet-1', id, 'Портмоне «Атбасар»', 'Компактное портмоне на 6 карт с монетницей.', 15000, true, 7
from public.categories where slug = 'wallets'
on conflict (slug) do nothing;
