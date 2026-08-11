import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0]?.url;

  return (
    <Link href={`/product/${product.slug}`} className="card group block overflow-hidden">
      <div className="relative aspect-square w-full overflow-hidden bg-saddle-100">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-wide text-saddle-400">
            Фото скоро
          </div>
        )}
        {product.is_made_to_order && <span className="tag-order absolute left-3 top-3">Под заказ</span>}
      </div>
      <div className="p-4">
        <h3 className="text-[15px] font-medium text-ink">{product.name}</h3>
        <p className="mt-1.5 font-mono text-sm text-saddle-500">
          {product.price.toLocaleString("ru-RU")} ₸
        </p>
      </div>
    </Link>
  );
}
