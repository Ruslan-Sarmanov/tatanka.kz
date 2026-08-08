import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildPaymentUrl } from "@/lib/robokassa";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("order");

  if (!orderId) {
    return NextResponse.json({ error: "order обязателен" }, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, order_number, total, contact_email")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
  }

  const paymentUrl = buildPaymentUrl({
    orderId: order.order_number, // Robokassa InvId — числовое поле
    sum: order.total,
    description: `Оплата заказа TATANKA.KZ №${order.order_number}`,
    email: order.contact_email,
  });

  return NextResponse.redirect(paymentUrl);
}
