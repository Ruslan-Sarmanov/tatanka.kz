import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0]?.url;

  return (
    <Link href={`/product/${product.slug}`} className="card group overflow-hidden">
      <div className="relative aspect-square w-full overflow-hidden bg-leather-100">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-leather-300">Фото скоро</div>
        )}
        {product.is_made_to_order && (
          <span className="absolute left-2 top-2 rounded bg-leather-700/90 px-2 py-1 text-xs text-white">
            Под заказ
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-leather-900">{product.name}</h3>
        <p className="mt-1 text-leather-600">{product.price.toLocaleString("ru-RU")} ₸</p>
      </div>
    </Link>
  );
}
