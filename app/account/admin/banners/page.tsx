import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function AdminBannersPage() {
  const supabase = createClient();
  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-leather-800">Баннеры</h1>
        <Link href="/account/admin/banners/new" className="btn-primary">
          Добавить баннер
        </Link>
      </div>

      <div className="card divide-y divide-leather-100">
        {(banners ?? []).map((b) => (
          <Link
            key={b.id}
            href={`/account/admin/banners/${b.id}`}
            className="flex items-center gap-4 px-4 py-3 text-sm hover:bg-leather-50"
          >
            <div className="relative h-12 w-24 shrink-0 overflow-hidden rounded bg-leather-100">
              <Image src={b.image_url} alt="" fill className="object-cover" unoptimized />
            </div>
            <span className="flex-1 font-medium">{b.title || "Без названия"}</span>
            <span className="max-w-xs truncate font-mono text-xs text-leather-500">{b.link_url}</span>
            <span className={b.is_active ? "text-green-700" : "text-leather-400"}>
              {b.is_active ? "Активен" : "Скрыт"}
            </span>
          </Link>
        ))}
        {(banners ?? []).length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-leather-500">Баннеров пока нет.</p>
        )}
      </div>
    </div>
  );
}
