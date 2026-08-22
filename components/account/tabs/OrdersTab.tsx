"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import OrderCalendar from "./OrderCalendar";
import { ORDER_STATUSES } from "@/lib/order-status";
import type { OrderStatus } from "@/lib/types";

const PAGE_SIZE = 25;

function toISODate(dateStr: string) {
  return dateStr.slice(0, 10);
}

export default function OrdersTab({ orders }: { orders: any[] }) {
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<Set<OrderStatus>>(new Set());
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [calendarDate, setCalendarDate] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const ordersByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders) {
      const iso = toISODate(o.created_at);
      map.set(iso, (map.get(iso) ?? 0) + 1);
    }
    return map;
  }, [orders]);

  function toggleStatus(status: OrderStatus) {
    setStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
    setVisibleCount(PAGE_SIZE);
  }

  function selectCalendarDate(date: string | null) {
    setCalendarDate(date);
    if (date) {
      setDateFrom(date);
      setDateTo(date);
    } else {
      setDateFrom("");
      setDateTo("");
    }
    setVisibleCount(PAGE_SIZE);
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((o: any) => {
      if (statuses.size > 0 && !statuses.has(o.status)) return false;

      const iso = toISODate(o.created_at);
      if (dateFrom && iso < dateFrom) return false;
      if (dateTo && iso > dateTo) return false;

      if (query) {
        const inNumber = String(o.order_number).includes(query);
        const inName = (o.contact_name ?? "").toLowerCase().includes(query);
        const inProducts = (o.order_items ?? []).some((item: any) =>
          (item.product_name ?? "").toLowerCase().includes(query)
        );
        if (!inNumber && !inName && !inProducts) return false;
      }

      return true;
    });
  }, [orders, search, statuses, dateFrom, dateTo]);

  const visible = filtered.slice(0, visibleCount);
  const hasFilters = search || statuses.size > 0 || dateFrom || dateTo;

  return (
    <div>
      <h3 className="mb-4 font-medium text-leather-800">
        Заказы <span className="font-normal text-leather-400">({filtered.length})</span>
      </h3>

      <div className="mb-4 flex flex-col gap-4 lg:flex-row">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Поиск: номер, имя, товар…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
              className="input-field"
              style={{ width: "18rem", maxWidth: "100%" }}
            />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setCalendarDate(null); setVisibleCount(PAGE_SIZE); }}
              className="input-field"
              style={{ width: "9.5rem", maxWidth: "100%" }}
            />
            <span className="text-leather-400">—</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setCalendarDate(null); setVisibleCount(PAGE_SIZE); }}
              className="input-field"
              style={{ width: "9.5rem", maxWidth: "100%" }}
            />
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearch(""); setStatuses(new Set()); setDateFrom(""); setDateTo("");
                  setCalendarDate(null); setVisibleCount(PAGE_SIZE);
                }}
                className="text-sm text-leather-500 underline hover:text-leather-800"
              >
                Сбросить всё
              </button>
            )}
          </div>

          {/* Мультивыбор статусов — можно отметить сразу несколько,
              например "В изготовлении" + "Отправлен", чтобы увидеть все
              незавершённые заказы разом. */}
          <div className="flex flex-wrap gap-2">
            {ORDER_STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => toggleStatus(s.value)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  statuses.has(s.value)
                    ? "border-saddle-500 bg-saddle-500 text-white"
                    : "border-leather-200 text-leather-600 hover:bg-leather-50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <OrderCalendar
          ordersByDate={ordersByDate}
          selectedDate={calendarDate}
          onSelectDate={selectCalendarDate}
        />
      </div>

      <div className="divide-y divide-leather-100 rounded-sm border border-leather-100">
        {visible.map((o: any) => (
          <Link
            key={o.id}
            href={`/account/admin/orders/${o.id}`}
            className="block px-4 py-3 text-sm hover:bg-leather-50"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-medium">№{o.order_number}</span>
              <span className="text-leather-600">{o.contact_name}</span>
              <span className="text-leather-500">
                {new Date(o.created_at).toLocaleDateString("ru-RU")}
              </span>
              <OrderStatusBadge status={o.status} />
              <span className="ml-auto font-medium">{Number(o.total).toLocaleString("ru-RU")} ₸</span>
            </div>

            <div className="mt-2 flex flex-wrap gap-3">
              {(o.order_items ?? []).map((item: any) => {
                const sortedImages = [...(item.product?.images ?? [])].sort(
                  (a: any, b: any) => a.sort_order - b.sort_order
                );
                const thumb = sortedImages[0]?.url as string | undefined;
                return (
                  <div key={item.id} className="flex items-center gap-2">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded bg-leather-100">
                      {thumb && <Image src={thumb} alt="" fill className="object-cover" unoptimized />}
                    </div>
                    <span className="text-leather-500">
                      {item.product_name}
                      {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-leather-500">
            {orders.length === 0 ? "Заказов пока нет." : "По этому фильтру ничего не нашлось."}
          </p>
        )}
      </div>

      {visibleCount < filtered.length && (
        <button
          type="button"
          onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
          className="btn-secondary mt-4 w-full text-sm"
        >
          Показать ещё ({filtered.length - visibleCount})
        </button>
      )}
    </div>
  );
}
