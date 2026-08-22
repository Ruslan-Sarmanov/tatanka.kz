import Link from "next/link";
import Image from "next/image";
import type { Banner } from "@/lib/types";

export default function BannersTab({ banners }: { banners: Banner[] }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium text-leather-800">Баннеры</h3>
        <Link href="/account/admin/banners/new" className="btn-primary text-sm">
          Добавить баннер
        </Link>
      </div>

      <div className="divide-y divide-leather-100 rounded-sm border border-leather-100">
        {banners.map((b: any) => (
          <Link
            key={b.id}
            href={`/account/admin/banners/${b.id}`}
            className="flex flex-wrap items-center gap-4 px-4 py-3 text-sm hover:bg-leather-50"
          >
            <div className="relative h-12 w-24 shrink-0 overflow-hidden rounded bg-leather-100">
              <Image src={b.image_url} alt="" fill className="object-cover" unoptimized />
            </div>
            <span className="min-w-0 flex-1 font-medium">{b.title || "Без названия"}</span>
            <span className="max-w-xs shrink truncate font-mono text-xs text-leather-500">{b.link_url}</span>
            <span className={`shrink-0 ${b.is_active ? "text-green-700" : "text-leather-400"}`}>
              {b.is_active ? "Активен" : "Скрыт"}
            </span>
          </Link>
        ))}
        {banners.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-leather-500">Баннеров пока нет.</p>
        )}
      </div>
    </div>
  );
}
