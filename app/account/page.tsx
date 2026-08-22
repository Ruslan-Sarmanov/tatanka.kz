import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import { PAID_ORDER_STATUSES } from "@/lib/order-status";
import AccountTabs from "@/components/account/AccountTabs";
import type { AnalyticsRow } from "@/components/account/tabs/AnalyticsTab";
import type { FinanceOrderRow } from "@/components/account/tabs/FinanceTab";
import type { Message, StoreSettings } from "@/lib/types";

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account");

  const [{ data: profile }, { data: orders }, { data: myMessages }] = await Promise.all([
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
    supabase
      .from("messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
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
    allMessages: Message[];
    profiles: Record<string, { full_name: string | null }>;
    storeSettings: StoreSettings | null;
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
      { data: allMessagesRaw },
      { data: allProfiles },
      { data: storeSettingsRaw },
    ] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "paid"),
      supabase
        .from("products")
        .select(
          "id, name, price, category_id, stock_quantity, is_active, category:categories(name), images:product_images(url, sort_order)"
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
          "quantity, price, product:products(id, name, price, category_id, images:product_images(url, sort_order), category:categories(slug, name)), order:orders!inner(status, created_at)"
        )
        .in("order.status", PAID_ORDER_STATUSES),
      supabase
        .from("orders")
        .select("id, order_number, created_at, total, status, order_items(quantity, price, product:products(cost))")
        .in("status", PAID_ORDER_STATUSES)
        .order("created_at", { ascending: false }),
      supabase.from("messages").select("*").order("created_at", { ascending: true }),
      supabase.from("profiles").select("id, full_name"),
      supabase.from("store_settings").select("*").eq("id", 1).single(),
    ]);

    const { data: revenueRows } = await supabase.from("orders").select("total").eq("status", "paid");
    const revenue = (revenueRows ?? []).reduce((sum, o: any) => sum + Number(o.total), 0);

    // Аналитика: отдаём "сырые" строки по позициям (без группировки) —
    // группировка по товару теперь считается на клиенте, ПОСЛЕ применения
    // фильтра по датам (иначе фильтр по датам не мог бы работать).
    const analyticsRows: AnalyticsRow[] = ((analyticsItemRows ?? []) as any[])
      .filter((item) => item.product)
      .map((item) => {
        const p = item.product;
        const sortedImages = [...(p.images ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order);
        return {
          orderDate: (item.order?.created_at ?? "").slice(0, 10),
          productId: p.id,
          name: p.name,
          image: sortedImages[0]?.url ?? null,
          categorySlug: p.category?.slug ?? null,
          categoryName: p.category?.name ?? "—",
          price: Number(p.price),
          qty: item.quantity,
          revenue: Number(item.price) * item.quantity,
        };
      });

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

    const profilesLookup: Record<string, { full_name: string | null }> = {};
    for (const p of allProfiles ?? []) {
      profilesLookup[p.id] = { full_name: p.full_name };
    }

    adminData = {
      productsCount: productsCount ?? 0,
      ordersCount: ordersCount ?? 0,
      revenue,
      newOrdersCount: newOrdersCount ?? 0,
      products: products ?? [],
      categories: categories ?? [],
      banners: banners ?? [],
      adminOrders: adminOrders ?? [],
      analyticsRows,
      financeOrders,
      allMessages: (allMessagesRaw ?? []) as Message[],
      profiles: profilesLookup,
      storeSettings: (storeSettingsRaw as StoreSettings | null) ?? null,
    };
  }

  return (
    <div className="container-page space-y-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-leather-800">Личный кабинет</h1>
        <SignOutButton />
      </div>

      <AccountTabs
        profile={profile ? { full_name: profile.full_name, phone: profile.phone } : null}
        email={user.email ?? ""}
        orders={orders ?? []}
        isAdmin={isAdmin}
        myMessages={(myMessages ?? []) as Message[]}
        adminData={adminData}
      />
    </div>
  );
}
