import Link from "next/link";
import Image from "next/image";
import type { Banner } from "@/lib/types";

export default function PromoBanners({ banners }: { banners: Banner[] }) {
  if (banners.length === 0) return null;

  return (
    <section className="container-page py-8">
      <div className="space-y-4">
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.link_url}
            className="stitch-frame group relative block h-40 w-full overflow-hidden rounded-sm bg-saddle-100 sm:h-52 md:h-64"
          >
            <Image
              src={banner.image_url}
              alt={banner.title ?? "Акция"}
              fill
              sizes="100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
