"use client";

import { useState } from "react";
import Link from "next/link";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import AdminPanel from "@/components/account/AdminPanel";
import type { Category, Banner } from "@/lib/types";
import type { AnalyticsRow } from "@/components/account/tabs/AnalyticsTab";
import type { FinanceOrderRow } from "@/components/account/tabs/FinanceTab";

type Order = {
  id: string;
  order_number: number;
  status: string;
  total: number;
  created_at: string;
};

export default function AccountTabs({
  profile,
  email,
  orders,
  isAdmin,
  adminData,
}: {
  profile: { full_name: string | null; phone: string | null } | null;
  email: string;
  orders: Order[];
  isAdmin: boolean;
  adminData: {
    productsCount: number;
    ordersCount: number;
    revenue: number;
    newOrdersCount: number;
    products: any[];
    categories: Category[];
    banners: Banner[];
    adminOrders: any[];
    analyticsRows: AnalyticsRow[];
    financeOrders: FinanceOrderRow[];
  } | null;
}) {
  const tabs = [
    { id: "profile", label: "Профиль" },
    { id: "orders", label: "Последние заказы" },
    ...(isAdmin ? [{ id: "admin", label: "Управление магазином" }] : []),
  ] as const;

  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("profile");

  return (
    <div>
      {/* Верхний уровень вкладок — та же логика, что и внутри "Управления
          магазином": переключение чисто на клиенте, адрес всегда /account. */}
      <div className="mb-6 flex flex-wrap gap-6 border-b border-leather-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`relative pb-3 text-sm font-medium transition ${
              active === t.id ? "text-saddle-600" : "text-leather-500 hover:text-leather-800"
            }`}
          >
            {t.label}
            {active === t.id && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-saddle-500" />
            )}
            {t.id === "admin" && adminData && adminData.newOrdersCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white align-middle">
                {adminData.newOrdersCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {active === "profile" && (
        <div className="card p-6">
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-leather-500">Имя</dt>
              <dd className="text-leather-900">{profile?.full_name || "—"}</dd>
            </div>
            <div>
              <dt className="text-leather-500">Телефон</dt>
              <dd className="text-leather-900">{profile?.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-leather-500">Email</dt>
              <dd className="text-leather-900">{email}</dd>
            </div>
          </dl>
        </div>
      )}

      {active === "orders" && (
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-leather-800">Последние заказы</h2>
            <Link href="/account/orders" className="text-sm underline text-leather-700">
              Все заказы
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-sm text-leather-500">У вас пока нет заказов.</p>
          ) : (
            <ul className="divide-y divide-leather-100">
              {orders.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                  <Link href={`/account/orders/${o.id}`} className="underline">
                    Заказ №{o.order_number}
                  </Link>
                  <span className="text-leather-500">
                    {new Date(o.created_at).toLocaleDateString("ru-RU")}
                  </span>
                  <OrderStatusBadge status={o.status} />
                  <span className="ml-auto font-medium">{o.total.toLocaleString("ru-RU")} ₸</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {active === "admin" && isAdmin && adminData && (
        <AdminPanel
          productsCount={adminData.productsCount}
          ordersCount={adminData.ordersCount}
          revenue={adminData.revenue}
          newOrdersCount={adminData.newOrdersCount}
          products={adminData.products}
          categories={adminData.categories}
          banners={adminData.banners}
          orders={adminData.adminOrders}
          analyticsRows={adminData.analyticsRows}
          financeOrders={adminData.financeOrders}
        />
      )}
    </div>
  );
}
