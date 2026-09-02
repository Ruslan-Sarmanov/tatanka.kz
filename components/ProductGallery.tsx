"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";
import { useLang } from "@/components/i18n/LangProvider";

export default function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];
  const { dict } = useLang();

  return (
    <div>
      <div className="stitch-frame relative aspect-square w-full overflow-hidden rounded-sm bg-saddle-100">
        {current ? (
          <Image
            src={current.url}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-wide text-saddle-400">
            {dict.product.photoSoon}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2.5">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border transition ${
                i === active ? "border-saddle-500" : "border-saddle-100 opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img.url} alt="" fill sizes="64px" className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
