"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Banner } from "@/lib/types";

const AUTOPLAY_MS = 5000;

export default function PromoBanners({ banners }: { banners: Banner[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % banners.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <section className="container-page py-8">
      {/* object-contain (не cover) — баннер показывается целиком, без
          обрезки краёв, даже если пропорции загруженной картинки не
          совпадают ровно с шириной блока. Тёмный фон-подложка того же
          тона, что у героя, скрадывает возможные пустые поля по бокам. */}
      <div className="stitch-frame relative h-56 w-full overflow-hidden rounded-sm bg-ink sm:h-72">
        {banners.map((banner, i) => (
          <Link
            key={banner.id}
            href={banner.link_url}
            aria-hidden={i !== active}
            tabIndex={i === active ? 0 : -1}
            className="absolute inset-0 block transition-opacity duration-700"
            style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}
          >
            <Image
              src={banner.image_url}
              alt={banner.title ?? "Акция"}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-contain"
              unoptimized
            />
          </Link>
        ))}

        {banners.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((banner, i) => (
              <button
                key={banner.id}
                type="button"
                aria-label={`Слайд ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-6 bg-parchment" : "w-1.5 bg-parchment/50 hover:bg-parchment/75"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
