"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import DeleteOrderButton from "@/components/admin/DeleteOrderButton";
import OrderCalendar from "./OrderCalendar";
import { ORDER_STATUSES } from "@/lib/order-status";
import { createClient } from "@/lib/supabase/client";
import type { OrderStatus } from "@/lib/types";

const PAGE_SIZE = 25;

function toISODate(dateStr: string) {
  return dateStr.slice(0, 10);
}

export default function OrdersTab({ orders }: { orders: any[] }) {
  const router = useRouter();
  const supabase = createClient();

  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<Set<OrderStatus>>(new Set());
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [calendarDate, setCalendarDate] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Массовые действия: выбор нескольких заказов чекбоксами, затем сразу
  // удалить все выбранные или сменить им статус одной операцией.
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>("in_production");
  const [bulkLoading, setBulkLoading] = useState(false);

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

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allVisibleSelected = visible.length > 0 && visible.every((o: any) => selected.has(o.id));

  function toggleSelectAllVisible() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visible.forEach((o: any) => next.delete(o.id));
      } else {
        visible.forEach((o: any) => next.add(o.id));
      }
      return next;
    });
  }

  async function handleBulkDelete() {
    if (
      !confirm(
        `Удалить ${selected.size} ${selected.size === 1 ? "заказ" : "заказов"} безвозвратно? Это действие нельзя отменить.`
      )
    )
      return;
    setBulkLoading(true);
    const { error } = await supabase.from("orders").delete().in("id", Array.from(selected));
    setBulkLoading(false);
    if (error) {
      alert(`Не удалось удалить: ${error.message}`);
      return;
    }
    setSelected(new Set());
    router.refresh();
  }

  async function handleBulkStatus() {
    setBulkLoading(true);
    const { error } = await supabase
      .from("orders")
      .update({ status: bulkStatus })
      .in("id", Array.from(selected));
    setBulkLoading(false);
    if (error) {
      alert(`Не удалось изменить статус: ${error.message}`);
      return;
    }
    setSelected(new Set());
    router.refresh();
  }

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

      {/* Панель выбора: отметь заказы галочками — сверху появляется, что
          можно с ними сделать. */}
      <div className="mb-2 flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2 text-leather-600">
          <input
            type="checkbox"
            checked={allVisibleSelected}
            onChange={toggleSelectAllVisible}
            className="h-4 w-4"
          />
          Выбрать все на странице
        </label>

        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-sm bg-saddle-50 px-3 py-2">
            <span className="font-medium text-saddle-700">Выбрано: {selected.size}</span>

            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as OrderStatus)}
              className="input-field"
              style={{ width: "10rem", maxWidth: "100%" }}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleBulkStatus}
              disabled={bulkLoading}
              className="btn-secondary text-sm"
            >
              Применить статус
            </button>

            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={bulkLoading}
              className="text-sm text-red-600 underline hover:text-red-700"
            >
              Удалить выбранные
            </button>

            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-sm text-leather-500 underline hover:text-leather-800"
            >
              Снять выбор
            </button>
          </div>
        )}
      </div>

      <div className="divide-y divide-leather-100 rounded-sm border border-leather-100">
        {visible.map((o: any) => (
          <div key={o.id} className="relative px-4 py-3 text-sm hover:bg-leather-50">
            <Link
              href={`/account/admin/orders/${o.id}`}
              className="absolute inset-0 z-0"
              aria-label={`Заказ №${o.order_number}`}
            />
            <div className="relative z-10 flex flex-wrap items-center gap-3">
              <input
                type="checkbox"
                checked={selected.has(o.id)}
                onChange={() => toggleSelect(o.id)}
                onClick={(e) => e.stopPropagation()}
                className="h-4 w-4 shrink-0"
                aria-label={`Выбрать заказ №${o.order_number}`}
              />
              <span className="font-medium">№{o.order_number}</span>
              <span className="text-leather-600">{o.contact_name}</span>
              <span className="text-leather-500">
                {new Date(o.created_at).toLocaleDateString("ru-RU")}
              </span>
              <OrderStatusBadge status={o.status} />
              <span className="ml-auto font-medium">{Number(o.total).toLocaleString("ru-RU")} ₸</span>
              <DeleteOrderButton orderId={o.id} orderNumber={o.order_number} />
            </div>

            <div className="relative z-10 mt-2 flex flex-wrap gap-3 pl-7">
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
          </div>
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
