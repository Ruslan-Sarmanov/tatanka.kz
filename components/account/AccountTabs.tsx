"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import AdminPanel from "@/components/account/AdminPanel";
import FeedbackTab from "@/components/FeedbackTab";
import { useLang } from "@/components/i18n/LangProvider";
import type { Category, Banner, Message, StoreSettings } from "@/lib/types";
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
  myMessages,
  adminData,
}: {
  profile: { full_name: string | null; phone: string | null } | null;
  email: string;
  orders: Order[];
  isAdmin: boolean;
  myMessages: Message[];
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
    allMessages: Message[];
    profiles: Record<string, { full_name: string | null }>;
    storeSettings: StoreSettings | null;
  } | null;
}) {
  const { dict, lang } = useLang();

  // "Обратная связь" — только у обычных покупателей: у админа для этого
  // есть вкладка "Сообщения" внутри "Управления магазином", где видны
  // переписки со всеми покупателями сразу. Сама вкладка "Управление
  // магазином" НЕ переводится — админка полностью остаётся на русском
  // независимо от переключателя языка, это осознанное решение.
  const tabs = [
    { id: "profile", label: dict.account.tabProfile },
    { id: "orders", label: dict.account.tabOrders },
    ...(!isAdmin ? [{ id: "feedback", label: dict.account.tabFeedback }] : []),
    ...(isAdmin ? [{ id: "admin", label: "Управление магазином" }] : []),
  ] as const;

  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const initialTab =
    tabs.find((t) => t.id === requestedTab)?.id ?? "profile";

  const [active, setActive] = useState<(typeof tabs)[number]["id"]>(initialTab);

  const unreadFeedbackCount = myMessages.filter(
    (m) => m.sender_role === "admin" && !m.read_by_customer
  ).length;

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
            {t.id === "feedback" && unreadFeedbackCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white align-middle">
                {unreadFeedbackCount}
              </span>
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
              <dt className="text-leather-500">{dict.account.name}</dt>
              <dd className="text-leather-900">{profile?.full_name || "—"}</dd>
            </div>
            <div>
              <dt className="text-leather-500">{dict.account.phone}</dt>
              <dd className="text-leather-900">{profile?.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-leather-500">{dict.account.email}</dt>
              <dd className="text-leather-900">{email}</dd>
            </div>
          </dl>
        </div>
      )}

      {active === "orders" && (
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-leather-800">{dict.account.recentOrders}</h2>
            <Link href="/account/orders" className="text-sm underline text-leather-700">
              {dict.account.allOrders}
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-sm text-leather-500">{dict.account.noOrders}</p>
          ) : (
            <ul className="divide-y divide-leather-100">
              {orders.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                  <Link href={`/account/orders/${o.id}`} className="underline">
                    {dict.account.orderNumber(o.order_number)}
                  </Link>
                  <span className="text-leather-500">
                    {new Date(o.created_at).toLocaleDateString(lang === "kk" ? "kk-KZ" : "ru-RU")}
                  </span>
                  <OrderStatusBadge status={o.status} />
                  <span className="ml-auto font-medium">{o.total.toLocaleString("ru-RU")} ₸</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {active === "feedback" && !isAdmin && <FeedbackTab initialMessages={myMessages} />}

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
          allMessages={adminData.allMessages}
          profiles={adminData.profiles}
          storeSettings={adminData.storeSettings}
        />
      )}
    </div>
  );
}
