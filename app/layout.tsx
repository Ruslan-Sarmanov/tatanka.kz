import type { Metadata } from "next";
import { Roboto_Slab, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

export const metadata: Metadata = {
  title: "TATANKA.KZ — кожаные аксессуары ручной работы под заказ",
  description:
    "Ремни, кошельки, сумки и другие аксессуары из натуральной кожи, изготовленные вручную под заказ в Казахстане.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col bg-parchment font-sans text-ink antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
