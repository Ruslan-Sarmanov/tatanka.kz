"use client";

import { useMemo, useState } from "react";
import { orderStatusLabel } from "@/lib/order-status";

export type FinanceOrderRow = {
  id: string;
  orderNumber: number;
  createdAt: string;
  total: number;
  cost: number;
  profit: number;
  status: string;
};

export default function FinanceTab({ orders }: { orders: FinanceOrderRow[] }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const d = o.createdAt.slice(0, 10);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }, [orders, from, to]);

  const totals = filtered.reduce(
    (acc, r) => ({
      revenue: acc.revenue + r.total,
      cost: acc.cost + r.cost,
      profit: acc.profit + r.profit,
    }),
    { revenue: 0, cost: 0, profit: 0 }
  );

  return (
    <div>
      <h3 className="mb-4 font-medium text-leather-800">Финансы</h3>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs text-leather-500">С</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="input-field"
            style={{ width: "10rem", maxWidth: "100%" }}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-leather-500">По</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="input-field"
            style={{ width: "10rem", maxWidth: "100%" }}
          />
        </div>
        {(from || to) && (
          <button
            type="button"
            onClick={() => { setFrom(""); setTo(""); }}
            className="text-sm text-leather-500 underline hover:text-leather-800"
          >
            Сбросить
          </button>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-leather-100 p-6">
          <p className="text-sm text-leather-500">Выручка</p>
          <p className="mt-2 text-2xl font-semibold text-leather-900">
            {totals.revenue.toLocaleString("ru-RU")} ₸
          </p>
        </div>
        <div className="rounded-sm border border-leather-100 p-6">
          <p className="text-sm text-leather-500">Себестоимость</p>
          <p className="mt-2 text-2xl font-semibold text-leather-900">
            {totals.cost.toLocaleString("ru-RU")} ₸
          </p>
        </div>
        <div className="rounded-sm border border-leather-100 p-6">
          <p className="text-sm text-leather-500">Чистая прибыль</p>
          <p className="mt-2 text-2xl font-semibold text-green-700">
            {totals.profit.toLocaleString("ru-RU")} ₸
          </p>
        </div>
      </div>

      {filtered.some((r) => r.cost === 0) && (
        <p className="mb-4 text-xs text-amber-600">
          У части заказов себестоимость товаров не указана в карточке — прибыль по ним посчитана
          как равная выручке. Заполните поле «Себестоимость» в товарах для точного расчёта.
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-sm border border-dashed border-leather-200 py-16 text-center">
          <p className="text-sm text-leather-500">Оплаченных заказов за этот период нет.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-sm border border-leather-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-leather-100 bg-leather-50 text-left text-xs uppercase text-leather-500">
                <tr>
                  <th className="px-4 py-3">Заказ</th>
                  <th className="px-4 py-3">Дата</th>
                  <th className="px-4 py-3">Статус</th>
                  <th className="px-4 py-3">Выручка</th>
                  <th className="px-4 py-3">Себестоимость</th>
                  <th className="px-4 py-3">Прибыль</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-leather-100">
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-medium">№{r.orderNumber}</td>
                    <td className="px-4 py-3 text-leather-500">
                      {new Date(r.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-4 py-3">{orderStatusLabel(r.status)}</td>
                    <td className="px-4 py-3">{r.total.toLocaleString("ru-RU")} ₸</td>
                    <td className="px-4 py-3 text-leather-500">{r.cost.toLocaleString("ru-RU")} ₸</td>
                    <td className="px-4 py-3 font-medium text-green-700">
                      {r.profit.toLocaleString("ru-RU")} ₸
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
