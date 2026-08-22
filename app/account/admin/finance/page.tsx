import { createClient } from "@/lib/supabase/server";
import { PAID_ORDER_STATUSES, orderStatusLabel } from "@/lib/order-status";

type OrderRow = {
  id: string;
  orderNumber: number;
  createdAt: string;
  total: number;
  cost: number;
  profit: number;
  status: string;
};

export default async function AdminFinancePage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("orders")
    .select("id, order_number, created_at, total, status, order_items(quantity, price, product:products(cost))")
    .in("status", PAID_ORDER_STATUSES)
    .order("created_at", { ascending: false });

  if (searchParams.from) query = query.gte("created_at", searchParams.from);
  if (searchParams.to) {
    // to-дата включительно — прибавляем сутки, чтобы захватить весь день.
    const toDate = new Date(searchParams.to);
    toDate.setDate(toDate.getDate() + 1);
    query = query.lt("created_at", toDate.toISOString());
  }

  const { data: orders } = await query;

  const rows: OrderRow[] = (orders ?? []).map((o: any) => {
    const cost = (o.order_items ?? []).reduce(
      (sum: number, item: any) => sum + item.quantity * Number(item.product?.cost ?? 0),
      0
    );
    const total = Number(o.total);
    return {
      id: o.id,
      orderNumber: o.order_number,
      createdAt: o.created_at,
      total,
      cost,
      profit: total - cost,
      status: o.status,
    };
  });

  const totals = rows.reduce(
    (acc, r) => ({
      revenue: acc.revenue + r.total,
      cost: acc.cost + r.cost,
      profit: acc.profit + r.profit,
    }),
    { revenue: 0, cost: 0, profit: 0 }
  );

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-leather-800">Финансы</h1>

      <form className="mb-6 flex flex-wrap items-end gap-3" method="GET">
        <div>
          <label className="mb-1 block text-xs text-leather-500">С</label>
          <input type="date" name="from" defaultValue={searchParams.from ?? ""} className="input-field" style={{ width: "10rem", maxWidth: "100%" }} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-leather-500">По</label>
          <input type="date" name="to" defaultValue={searchParams.to ?? ""} className="input-field" style={{ width: "10rem", maxWidth: "100%" }} />
        </div>
        <button type="submit" className="btn-secondary">Применить</button>
      </form>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-6">
          <p className="text-sm text-leather-500">Выручка</p>
          <p className="mt-2 text-2xl font-semibold text-leather-900">
            {totals.revenue.toLocaleString("ru-RU")} ₸
          </p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-leather-500">Себестоимость</p>
          <p className="mt-2 text-2xl font-semibold text-leather-900">
            {totals.cost.toLocaleString("ru-RU")} ₸
          </p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-leather-500">Чистая прибыль</p>
          <p className="mt-2 text-2xl font-semibold text-green-700">
            {totals.profit.toLocaleString("ru-RU")} ₸
          </p>
        </div>
      </div>

      {rows.some((r) => r.cost === 0) && (
        <p className="mb-4 text-xs text-amber-600">
          У части заказов себестоимость товаров не указана в карточке — прибыль по ним посчитана
          как равная выручке. Заполните поле «Себестоимость» в товарах для точного расчёта.
        </p>
      )}

      {rows.length === 0 ? (
        <div className="card border-dashed py-16 text-center">
          <p className="text-sm text-leather-500">Оплаченных заказов за этот период нет.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
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
                {rows.map((r) => (
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
