import Link from "next/link";
import Image from "next/image";

const LOW_STOCK_THRESHOLD = 2;

function StockBadge({ qty }: { qty: number | null }) {
  if (qty === null) return <span className="text-leather-400">не отслеживается</span>;
  if (qty === 0) return <span className="font-medium text-red-600">0 шт</span>;
  if (qty <= LOW_STOCK_THRESHOLD) return <span className="font-medium text-amber-600">{qty} шт — мало</span>;
  return <span className="text-leather-700">{qty} шт</span>;
}

export default function ProductsTab({ products }: { products: any[] }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium text-leather-800">Товары</h3>
        <Link href="/account/admin/products/new" className="btn-primary text-sm">
          Добавить товар
        </Link>
      </div>

      <div className="divide-y divide-leather-100 rounded-sm border border-leather-100">
        {products.map((p: any) => {
          const sortedImages = [...(p.images ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order);
          const thumb = sortedImages[0]?.url as string | undefined;

          return (
            <Link
              key={p.id}
              href={`/account/admin/products/${p.id}`}
              className="flex items-center gap-4 px-4 py-3 text-sm hover:bg-leather-50"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-leather-100">
                {thumb ? (
                  <Image src={thumb} alt="" fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full items-center justify-center text-[9px] uppercase text-leather-400">
                    Нет фото
                  </div>
                )}
              </div>
              <span className="flex-1 font-medium">{p.name}</span>
              <span className="text-leather-500">{p.category?.name ?? "—"}</span>
              <span>{Number(p.price).toLocaleString("ru-RU")} ₸</span>
              <span className="w-28 text-right">
                <StockBadge qty={p.stock_quantity} />
              </span>
              <span className={p.is_active ? "text-green-700" : "text-leather-400"}>
                {p.is_active ? "Активен" : "Скрыт"}
              </span>
            </Link>
          );
        })}
        {products.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-leather-500">Товаров пока нет.</p>
        )}
      </div>
    </div>
  );
}
