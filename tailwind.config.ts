import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Палитра построена на реальных цветах, снятых с фирменного
        // логотипа (тёмная метка и карамельная метка), а не подобрана
        // "на глаз" — так вся система остаётся привязана к бренду.
        ink: {
          DEFAULT: "#170D07", // почти чёрный, с тёплым коричневым подтоном — герой, футер
          soft: "#2A180E", // чуть светлее, для карточек на тёмном фоне
        },
        saddle: {
          50: "#FBF7F1",
          100: "#F3E6D4",
          200: "#E4C7A0",
          300: "#D0A06B", // карамельная нить — акцент, "строчка"
          400: "#B4854F",
          500: "#8A5A30", // основной бренд-коричневый — кнопки, ссылки
          600: "#6E4524",
          700: "#54341B",
          800: "#3A2412",
          900: "#241608",
        },
        // Временный алиас на время поэтапного перевода остальных страниц
        // (каталог/товар/корзина/кабинет/админка) на новую систему — те
        // страницы пока используют старые классы leather-*, и без этого
        // алиаса выглядели бы "сломанными" (неопределённые классы).
        // Убрать после того, как все страницы переедут на saddle/ink/card.
        leather: {
          50: "#FBF7F1",
          100: "#F3E6D4",
          200: "#E4C7A0",
          300: "#D0A06B",
          400: "#B4854F",
          500: "#8A5A30",
          600: "#6E4524",
          700: "#54341B",
          800: "#3A2412",
          900: "#241608",
        },
        brass: "#A9824F", // фурнитура пряжек — используется точечно
        parchment: "#F6F0E3", // фон страницы
        card: "#FDFBF6", // фон карточек — чуть светлее parchment
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "stitch-x": "repeating-linear-gradient(90deg, var(--stitch-color, #D0A06B) 0 8px, transparent 8px 16px)",
        "stitch-y": "repeating-linear-gradient(180deg, var(--stitch-color, #D0A06B) 0 8px, transparent 8px 16px)",
      },
      letterSpacing: {
        wideish: "0.02em",
      },
    },
  },
  plugins: [],
};

export default config;
