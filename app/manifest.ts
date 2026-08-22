import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tatanka.kz — кожаные изделия ручной работы",
    short_name: "Tatanka",
    description: "Аксессуары из натуральной кожи ручной работы — Kazakhstan",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F0E3", // parchment
    theme_color: "#8A5A30", // saddle-500
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
