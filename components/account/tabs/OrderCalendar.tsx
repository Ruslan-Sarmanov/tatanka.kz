"use client";

import { useState } from "react";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

function toISODate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function OrderCalendar({
  ordersByDate,
  selectedDate,
  onSelectDate,
}: {
  ordersByDate: Map<string, number>;
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}) {
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstDay = new Date(year, month, 1);
  // Понедельник = 0 ... Воскресенье = 6 (вместо стандартного JS Sunday=0)
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const todayISO = toISODate(new Date());

  return (
    <div className="w-full shrink-0 rounded-sm border border-leather-100 p-3 lg:w-64">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonthCursor(new Date(year, month - 1, 1))}
          className="rounded px-2 py-1 text-leather-500 hover:bg-leather-50"
          aria-label="Предыдущий месяц"
        >
          ←
        </button>
        <span className="text-sm font-medium text-leather-800">{MONTH_NAMES[month]} {year}</span>
        <button
          type="button"
          onClick={() => setMonthCursor(new Date(year, month + 1, 1))}
          className="rounded px-2 py-1 text-leather-500 hover:bg-leather-50"
          aria-label="Следующий месяц"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-leather-400">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const iso = toISODate(new Date(year, month, day));
          const count = ordersByDate.get(iso) ?? 0;
          const isSelected = selectedDate === iso;
          const isToday = iso === todayISO;

          return (
            <button
              key={i}
              type="button"
              disabled={count === 0}
              onClick={() => onSelectDate(isSelected ? null : iso)}
              className={`relative rounded py-1.5 text-xs transition ${
                isSelected
                  ? "bg-saddle-500 font-medium text-white"
                  : count > 0
                  ? "bg-saddle-100 font-medium text-saddle-700 hover:bg-saddle-200"
                  : "text-leather-300"
              } ${isToday && !isSelected ? "ring-1 ring-saddle-300" : ""}`}
            >
              {day}
              {count > 0 && !isSelected && (
                <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-saddle-500" />
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-[11px] text-leather-400">
        Отмечены дни, в которые были заказы — нажми на день, чтобы отфильтровать.
      </p>
    </div>
  );
}
