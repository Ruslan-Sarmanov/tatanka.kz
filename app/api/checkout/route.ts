import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const body = await request.json();
  const { items, contactName, contactPhone, contactEmail, city, address, comment } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });
  }

  const total = items.reduce(
    (sum: number, i: any) => sum + i.price * i.quantity,
    0
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "awaiting_payment",
      total,
      contact_name: contactName,
      contact_phone: contactPhone,
      contact_email: contactEmail,
      delivery_city: city,
      delivery_address: address,
      comment: comment || null,
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message ?? "Не удалось создать заказ" },
      { status: 500 }
    );
  }

  const orderItems = items.map((i: any) => ({
    order_id: order.id,
    product_id: i.productId,
    product_name: i.name,
    quantity: i.quantity,
    price: i.price,
    customization: i.customization ?? null,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({ orderId: order.id, total });
}
