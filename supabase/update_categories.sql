-- Обновление разделов под реальный ассортимент tatanka.kz
-- Выполнить один раз в Supabase → SQL Editor (на уже работающем сайте)

insert into public.categories (slug, name, description, image_url, sort_order) values
  ('belts', 'Ремни', 'Кожаные ремни ручной работы под заказ', '/categories/remni.jpg', 1),
  ('wallets', 'Кошельки', 'Кошельки из натуральной кожи', '/categories/koshelki.jpg', 2),
  ('portmone', 'Портмоне', 'Портмоне ручной работы под заказ', '/categories/portmone.jpg', 3),
  ('bags', 'Сумки', 'Сумки и рюкзаки ручной работы', '/categories/sumki.jpg', 4),
  ('document-cases', 'Чехлы для документов', 'Чехлы для документов из натуральной кожи', '/categories/chehly-dokumenty.jpg', 5),
  ('document-covers', 'Обложки для документов', 'Обложки для документов ручной работы', '/categories/oblozhki-dokumenty.jpg', 6),
  ('card-holders', 'Картхолдеры', 'Картхолдеры из натуральной кожи', '/categories/kartholdery.jpg', 7),
  ('key-holders', 'Ключницы', 'Ключницы ручной работы', '/categories/klyuchnicy.jpg', 8)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;

-- Убираем старые разделы, которых больше нет в ассортименте
-- (товары в них, если есть, не удаляются — просто останутся без раздела)
delete from public.categories where slug in ('phone-cases', 'bracelets');
