"use client";

import { useState } from "react";
import type { Product, Category, Banner } from "@/lib/types";
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
    <div className="card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium text-leather-800">Управление магазином</h2>
        {newOrdersCount > 0 && active !== "orders" && (
          <button
            type="button"
            onClick={() => setActive("orders")}
            className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {newOrdersCount}
            </span>
            новых оплаченных
          </button>
        )}
      </div>

      {/* Вкладки — переключение чисто на клиенте, без перехода на другой
          адрес: URL всегда остаётся /account. */}
      <div className="mb-6 flex flex-wrap gap-1 border-b border-leather-100">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`rounded-t-sm px-3 py-2 text-sm font-medium transition ${
              active === t.id
                ? "border-b-2 border-saddle-500 text-saddle-600"
                : "text-leather-500 hover:text-leather-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
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
  );
}
