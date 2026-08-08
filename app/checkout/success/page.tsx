import Link from "next/link";

// SuccessURL Robokassa — куда браузер пользователя возвращается после успешной оплаты.
// В кабинете Robokassa: SuccessURL = https://tatanka.kz/checkout/success (метод GET)
export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { InvId?: string; OutSum?: string };
}) {
  return (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl text-leather-800">Оплата прошла успешно</h1>
      {searchParams.InvId && (
        <p className="mt-4 text-leather-600">
          Заказ №{searchParams.InvId} на сумму {searchParams.OutSum} ₸ оплачен.
        </p>
      )}
      <p className="mt-2 text-leather-600">
        Мы начнём изготовление вашего изделия и свяжемся с вами по указанным контактам.
      </p>
      <Link href="/account/orders" className="btn-primary mt-8 inline-flex">
        Мои заказы
      </Link>
    </div>
  );
}
