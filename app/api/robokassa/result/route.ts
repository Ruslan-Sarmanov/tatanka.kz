import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyResultSignature } from "@/lib/robokassa";

// ResultURL — Robokassa вызывает этот адрес со своего сервера (не браузер пользователя),
// поэтому используем admin-клиент (service role), а не сессию пользователя.
// В личном кабинете мерчанта Robokassa укажите:
//   ResultURL: https://tatanka.kz/api/robokassa/result  (метод POST)
async function handle(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let params: URLSearchParams;

  if (contentType.includes("application/json")) {
    const body = await request.json();
    params = new URLSearchParams(body);
  } else if (request.method === "GET") {
    params = new URL(request.url).searchParams;
  } else {
    const body = await request.text();
    params = new URLSearchParams(body);
  }

  const outSum = params.get("OutSum") ?? "";
  const invId = params.get("InvId") ?? "";
  const signature = params.get("SignatureValue") ?? "";

  if (!outSum || !invId || !signature) {
    return new NextResponse("bad request", { status: 400 });
  }

  const valid = verifyResultSignature({ outSum, invId, signature });
  if (!valid) {
    return new NextResponse("bad sign", { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: "paid", payment_id: invId })
    .eq("order_number", Number(invId));

  if (error) {
    return new NextResponse("db error", { status: 500 });
  }

  // Robokassa требует ответ строго в формате "OK{InvId}"
  return new NextResponse(`OK${invId}`);
}

export async function POST(request: Request) {
  return handle(request);
}

export async function GET(request: Request) {
  return handle(request);
}
