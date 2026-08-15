-- Тестовые данные для tatanka.kz — выполнить после schema.sql

insert into public.categories (slug, name, description, image_url, sort_order) values
  ('wallets', 'Кошельки', 'Кошельки из натуральной кожи', '/categories/koshelki.jpg', 2),
  ('portmone', 'Портмоне', 'Портмоне ручной работы под заказ', '/categories/portmone.jpg', 3),
  ('bags', 'Сумки', 'Сумки и рюкзаки ручной работы', '/categories/sumki.jpg', 4),
  ('document-covers', 'Обложки для документов', 'Обложки для документов ручной работы', '/categories/oblozhki-dokumenty.jpg', 6),
  ('card-holders', 'Картхолдеры', 'Картхолдеры из натуральной кожи', '/categories/kartholdery.jpg', 7),
  ('key-holders', 'Ключницы', 'Ключницы ручной работы', '/categories/klyuchnicy.jpg', 8)
on conflict (slug) do nothing;

insert into public.products (slug, category_id, name, description, price, is_made_to_order, lead_time_days)
select 'bifold-wallet-1', id, 'Портмоне «Атбасар»', 'Компактное портмоне на 6 карт с монетницей.', 15000, true, 7
from public.categories where slug = 'portmone'
on conflict (slug) do nothing;
