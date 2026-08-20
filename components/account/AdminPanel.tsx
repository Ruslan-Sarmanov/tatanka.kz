"use client";

import { useState } from "react";
import type { Category, Banner } from "@/lib/types";
import OverviewTab from "./tabs/OverviewTab";
import ProductsTab from "./tabs/ProductsTab";
import CategoriesTab from "./tabs/CategoriesTab";
import BannersTab from "./tabs/BannersTab";
import OrdersTab from "./tabs/OrdersTab";
import AnalyticsTab, { type AnalyticsRow } from "./tabs/AnalyticsTab";
import FinanceTab, { type FinanceOrderRow } from "./tabs/FinanceTab";

const TABS = [
  { id: "overview", label: "Обзор" },
  { id: "products", label: "Товары" },
  { id: "categories", label: "Категории" },
  { id: "banners", label: "Баннеры" },
  { id: "orders", label: "Заказы" },
  { id: "analytics", label: "Аналитика" },
  { id: "finance", label: "Финансы" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminPanel({
  productsCount,
  ordersCount,
  revenue,
  newOrdersCount,
  products,
  categories,
  banners,
  orders,
  analyticsRows,
  financeOrders,
}: {
  productsCount: number;
  ordersCount: number;
  revenue: number;
  newOrdersCount: number;
  products: any[];
  categories: Category[];
  banners: Banner[];
  orders: any[];
  analyticsRows: AnalyticsRow[];
  financeOrders: FinanceOrderRow[];
}) {
  const [active, setActive] = useState<TabId>("overview");

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-leather-100 px-6 py-4">
        <h2 className="text-lg font-medium text-leather-800">Управление магазином</h2>
      </div>

      {/* Слева — вертикальная навигация (как в классической админке),
          справа — содержимое активного раздела. Переключение чисто на
          клиенте: URL всегда остаётся /account, без перехода куда-либо. */}
      <div className="flex flex-col md:flex-row">
        <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-leather-100 p-3 md:w-48 md:flex-col md:overflow-visible md:border-b-0 md:border-r">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={`flex shrink-0 items-center justify-between rounded px-3 py-2 text-left text-sm font-medium transition md:shrink ${
                active === t.id
                  ? "bg-saddle-50 text-saddle-600"
                  : "text-leather-600 hover:bg-leather-50"
              }`}
            >
              <span>{t.label}</span>
              {t.id === "orders" && newOrdersCount > 0 && (
                <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                  {newOrdersCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 p-6">
          {active === "overview" && (
            <OverviewTab
              productsCount={productsCount}
              ordersCount={ordersCount}
              revenue={revenue}
              newOrdersCount={newOrdersCount}
              onOpenOrders={() => setActive("orders")}
            />
          )}
          {active === "products" && <ProductsTab products={products} />}
          {active === "categories" && <CategoriesTab categories={categories} />}
          {active === "banners" && <BannersTab banners={banners} />}
          {active === "orders" && <OrdersTab orders={orders} />}
          {active === "analytics" && <AnalyticsTab rows={analyticsRows} categories={categories} />}
          {active === "finance" && <FinanceTab orders={financeOrders} />}
        </div>
      </div>
    </div>
  );
}
