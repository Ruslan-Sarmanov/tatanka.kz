import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import { orderStatusLabel, PAID_ORDER_STATUSES } from "@/lib/order-status";
import AdminPanel from "@/components/account/AdminPanel";
import type { AnalyticsRow } from "@/components/account/tabs/AnalyticsTab";
import type { FinanceOrderRow } from "@/components/account/tabs/FinanceTab";

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account");

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, phone, role")
      .eq("id", user.id)
      .single(),
    supabase
      .from("orders")
      .select("id, order_number, status, total, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const isAdmin = profile?.role === "admin";

  // Все данные для админ-панели тянем один раз здесь и передаём вниз как
  // готовые пропсы — вкладки переключаются потом чисто на клиенте, без
  // повторных запросов и без смены адреса страницы.
  let adminData: {
    productsCount: number;
    ordersCount: number;
    revenue: number;
    newOrdersCount: number;
    products: any[];
    categories: any[];
    banners: any[];
    adminOrders: any[];
    analyticsRows: AnalyticsRow[];
    financeOrders: FinanceOrderRow[];
  } | null = null;

  if (isAdmin) {
    const [
      { count: productsCount },
      { count: ordersCount },
      { count: newOrdersCount },
      { data: products },
      { data: categories },
      { data: banners },
      { data: adminOrders },
      { data: analyticsItemRows },
      { data: financeOrdersRaw },
    ] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "paid"),
      supabase
        .from("products")
        .select(
          "id, name, price, stock_quantity, is_active, category:categories(name), images:product_images(url, sort_order)"
        )
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("sort_order", { ascending: true }),
      supabase.from("banners").select("*").order("sort_order", { ascending: true }),
      supabase
        .from("orders")
        .select(
          "id, order_number, status, total, contact_name, created_at, order_items(id, product_name, quantity, product:products(images:product_images(url, sort_order)))"
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("order_items")
        .select(
          "quantity, price, product:products(id, name, price, category_id, images:product_images(url, sort_order), category:categories(slug, name)), order:orders!inner(status)"
        )
        .in("order.status", PAID_ORDER_STATUSES),
      supabase
        .from("orders")
        .select("id, order_number, created_at, total, status, order_items(quantity, price, product:products(cost))")
        .in("status", PAID_ORDER_STATUSES)
        .order("created_at", { ascending: false }),
    ]);

    const { data: revenueRows } = await supabase.from("orders").select("total").eq("status", "paid");
    const revenue = (revenueRows ?? []).reduce((sum, o: any) => sum + Number(o.total), 0);

    // Аналитика: группируем позиции заказов по товару.
    const byProduct = new Map<string, AnalyticsRow>();
    for (const item of (analyticsItemRows ?? []) as any[]) {
      const p = item.product;
      if (!p) continue;
      const sortedImages = [...(p.images ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order);
      const image = sortedImages[0]?.url ?? null;
      const lineRevenue = Number(item.price) * item.quantity;
      const existing = byProduct.get(p.id);
      if (existing) {
        existing.qty += item.quantity;
        existing.revenue += lineRevenue;
      } else {
        byProduct.set(p.id, {
          productId: p.id,
          name: p.name,
          image,
          categorySlug: p.category?.slug ?? null,
          categoryName: p.category?.name ?? "—",
          price: Number(p.price),
          qty: item.quantity,
          revenue: lineRevenue,
        });
      }
    }

    // Финансы: считаем себестоимость/прибыль по каждому оплаченному заказу.
    const financeOrders: FinanceOrderRow[] = (financeOrdersRaw ?? []).map((o: any) => {
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

    adminData = {
      productsCount: productsCount ?? 0,
      ordersCount: ordersCount ?? 0,
      revenue,
      newOrdersCount: newOrdersCount ?? 0,
      products: products ?? [],
      categories: categories ?? [],
      banners: banners ?? [],
      adminOrders: adminOrders ?? [],
      analyticsRows: Array.from(byProduct.values()),
      financeOrders,
    };
  }

  return (
    <div className="container-page space-y-8 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-leather-800">Личный кабинет</h1>
        <SignOutButton />
      </div>

      <div className="card p-6">
        <h2 className="mb-4 text-lg font-medium text-leather-800">Профиль</h2>
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
            <dd className="text-leather-900">{user.email}</dd>
          </div>
        </dl>
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-leather-800">Последние заказы</h2>
          <Link href="/account/orders" className="text-sm underline text-leather-700">
            Все заказы
          </Link>
        </div>

        {!orders || orders.length === 0 ? (
          <p className="text-sm text-leather-500">У вас пока нет заказов.</p>
        ) : (
          <ul className="divide-y divide-leather-100">
            {orders.map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                <Link href={`/account/orders/${o.id}`} className="underline">
                  Заказ №{o.order_number}
                </Link>
                <span className="text-leather-500">{new Date(o.created_at).toLocaleDateString("ru-RU")}</span>
                <span>{orderStatusLabel(o.status)}</span>
                <span className="font-medium">{o.total.toLocaleString("ru-RU")} ₸</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isAdmin && adminData && (
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
