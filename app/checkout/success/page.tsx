import Link from "next/link";
import { verifySuccessSignature } from "@/lib/robokassa";

// SuccessURL Robokassa — куда браузер пользователя возвращается после успешной оплаты.
// В кабинете Robokassa: SuccessURL = https://tatanka.kz/checkout/success (метод GET)
// Robokassa добавляет к этому URL параметры InvId, OutSum и SignatureValue —
// подпись обязательно проверяем, иначе любой может подставить свои InvId/OutSum в адресную
// строку и увидеть фейковое сообщение об успешной оплате. Реальный статус заказа
// (оплачен/нет) в любом случае выставляется только через защищённый webhook
// /api/robokassa/result — эта страница лишь показывает пользователю подтверждение.
export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { InvId?: string; OutSum?: string; SignatureValue?: string };
}) {
  const { InvId, OutSum, SignatureValue } = searchParams;

  const isVerified =
    !!InvId &&
    !!OutSum &&
    !!SignatureValue &&
    verifySuccessSignature({ outSum: OutSum, invId: InvId, signature: SignatureValue });

  return (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl text-leather-800">Оплата прошла успешно</h1>
      {isVerified ? (
        <p className="mt-4 text-leather-600">
          Заказ №{InvId} на сумму {OutSum} ₸ оплачен.
        </p>
      ) : (
        <p className="mt-4 text-leather-600">
          Спасибо! Как только оплата будет подтверждена, статус заказа обновится в личном
          кабинете.
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
