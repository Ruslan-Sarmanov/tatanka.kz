import Link from "next/link";
import { getServerDictionary } from "@/lib/i18n/server";

// FailURL Robokassa — куда браузер пользователя возвращается при отмене/неудачной оплате.
// В кабинете Robokassa: FailURL = https://tatanka.kz/checkout/fail (метод GET)
export default function CheckoutFailPage({
  searchParams,
}: {
  searchParams: { InvId?: string };
}) {
  const t = getServerDictionary();

  return (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl text-leather-800">{t.checkout.failTitle}</h1>
      <p className="mt-4 text-leather-600">{t.checkout.failText}</p>
      <Link href="/account/orders" className="btn-primary mt-8 inline-flex">
        {t.checkout.myOrders}
      </Link>
    </div>
  );
}
