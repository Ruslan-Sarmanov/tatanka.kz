import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Личный кабинет, оформление заказа, корзина, избранное — не должны
      // индексироваться: это либо приватные данные, либо служебные
      // страницы без самостоятельной ценности для поиска.
      disallow: ["/account", "/checkout", "/cart", "/favorites", "/auth", "/api"],
    },
    sitemap: "https://tatanka.kz/sitemap.xml",
  };
}
