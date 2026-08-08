import Link from "next/link";

// FailURL Robokassa — куда браузер пользователя возвращается при отмене/неудачной оплате.
// В кабинете Robokassa: FailURL = https://tatanka.kz/checkout/fail (метод GET)
export default function CheckoutFailPage({
  searchParams,
}: {
  searchParams: { InvId?: string };
}) {
  return (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl text-leather-800">Оплата не завершена</h1>
      <p className="mt-4 text-leather-600">
        {searchParams.InvId
          ? `Платёж по заказу №${searchParams.InvId} не прошёл.`
          : "Платёж не прошёл."}{" "}
        Вы можете попробовать ещё раз из личного кабинета.
      </p>
      <Link href="/account/orders" className="btn-primary mt-8 inline-flex">
        Мои заказы
      </Link>
    </div>
  );
}
