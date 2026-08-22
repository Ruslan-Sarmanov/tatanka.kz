import type { Metadata } from "next";
import { Roboto_Slab, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LangProvider } from "@/components/i18n/LangProvider";
import { getServerLang } from "@/lib/i18n/server";

// Слэб-серив для заголовков — плотный, монолинейный, без тонко-контрастных
// засечек типичного "ИИ-серива". Отсылает к тиснению клеймом на коже.
const display = Roboto_Slab({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Гротеск для текста — спокойный, читаемый, не спорит с заголовками.
const sans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

// Моноширинный — для цен, артикулов, сроков изготовления. Ощущение
// машинописной бирки на изделии.
const mono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://tatanka.kz";
const SITE_TITLE = "TATANKA.KZ — кожаные аксессуары ручной работы под заказ";
const SITE_DESCRIPTION =
  "Кошельки, портмоне, сумки и другие аксессуары из натуральной кожи, изготовленные вручную под заказ в Казахстане.";

export const metadata: Metadata = {
  // metadataBase — без него Next.js не может построить абсолютные ссылки
  // для og:image/canonical на превью-доменах Vercel, а поисковики и
  // соцсети требуют именно абсолютные URL в этих тегах.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    // Дочерние страницы задают короткий title ("Кошельки" и т.п.), сюда
    // автоматически подставится "%s — TATANKA.KZ" — не нужно вручную
    // дописывать бренд на каждой странице.
    template: "%s — TATANKA.KZ",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "кожаные аксессуары",
    "кошелек из кожи",
    "портмоне",
    "сумки из кожи",
    "изделия из кожи на заказ",
    "handmade кожа Казахстан",
    "Актобе",
  ],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tatanka",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // По умолчанию разрешаем индексацию и переход по ссылкам всем страницам;
  // приватные/служебные (корзина, кабинет и т.д.) сами переопределяют это
  // на noindex через собственный metadata в своих page.tsx.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "TATANKA.KZ",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: "TATANKA.KZ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/icons/icon-512.png"],
  },
};

export const viewport = {
  themeColor: "#8A5A30",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = getServerLang();

  return (
    <html lang={lang} className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col bg-parchment font-sans text-ink antialiased">
        <LangProvider initialLang={lang}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
