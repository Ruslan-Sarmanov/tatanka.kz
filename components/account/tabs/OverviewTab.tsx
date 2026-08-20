"use client";

export default function OverviewTab({
  productsCount,
  ordersCount,
  revenue,
  newOrdersCount,
  onOpenOrders,
}: {
  productsCount: number;
  ordersCount: number;
  revenue: number;
  newOrdersCount: number;
  onOpenOrders: () => void;
}) {
  const cards = [
    { label: "Товары", value: productsCount },
    { label: "Заказы", value: ordersCount },
    { label: "Выручка (оплаченные)", value: `${revenue.toLocaleString("ru-RU")} ₸` },
  ];

  return (
    <div>
      {newOrdersCount > 0 && (
        <button
          type="button"
          onClick={onOpenOrders}
          className="mb-6 flex w-full items-center justify-between rounded-sm border border-red-200 bg-red-50 px-5 py-4 text-left text-sm transition hover:bg-red-100"
        >
          <span className="font-medium text-red-800">
            {newOrdersCount === 1
              ? "У вас 1 новый оплаченный заказ, требующий обработки"
              : `У вас ${newOrdersCount} новых оплаченных заказа, требующих обработки`}
          </span>
          <span className="text-red-700 underline">Открыть заказы →</span>
        </button>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-sm border border-leather-100 p-6">
            <p className="text-sm text-leather-500">{c.label}</p>
            <p className="mt-2 text-2xl font-semibold text-leather-900">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
