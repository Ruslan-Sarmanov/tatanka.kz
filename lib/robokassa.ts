import crypto from "crypto";

const MERCHANT_LOGIN = process.env.ROBOKASSA_MERCHANT_LOGIN!;
const PASSWORD1 = process.env.ROBOKASSA_PASSWORD1!;
const PASSWORD2 = process.env.ROBOKASSA_PASSWORD2!;
const IS_TEST = process.env.ROBOKASSA_TEST_MODE === "true";

function md5(input: string) {
  return crypto.createHash("md5").update(input, "utf8").digest("hex");
}

// Сумма должна быть строкой с двумя знаками после точки, как требует Robokassa.
function formatSum(sum: number) {
  return sum.toFixed(2);
}

/**
 * Формирует ссылку на оплату Robokassa для заказа.
 * orderId — числовой/строковый идентификатор заказа (InvId), sum — сумма в KZT/RUB.
 */
export function buildPaymentUrl(params: {
  orderId: string | number;
  sum: number;
  description: string;
  email?: string;
}) {
  const { orderId, sum, description, email } = params;
  const outSum = formatSum(sum);

  // Подпись: MerchantLogin:OutSum:InvId:Password1
  const signature = md5(
    `${MERCHANT_LOGIN}:${outSum}:${orderId}:${PASSWORD1}`
  );

  const query = new URLSearchParams({
    MerchantLogin: MERCHANT_LOGIN,
    OutSum: outSum,
    InvId: String(orderId),
    Description: description,
    SignatureValue: signature,
    Culture: "ru",
  });

  if (email) query.set("Email", email);
  if (IS_TEST) query.set("IsTest", "1");

  return `https://auth.robokassa.kz/Merchant/Index.aspx?${query.toString()}`;
}

/**
 * Проверяет подпись, которую Robokassa присылает на ResultURL (webhook).
 * Формат подписи: OutSum:InvId:Password2
 */
export function verifyResultSignature(params: {
  outSum: string;
  invId: string;
  signature: string;
}) {
  const expected = md5(
    `${params.outSum}:${params.invId}:${PASSWORD2}`
  ).toLowerCase();
  return expected === params.signature.toLowerCase();
}

/**
 * Проверяет подпись на SuccessURL (пользователь возвращается в браузере).
 * Формат подписи на Success/Fail: OutSum:InvId:Password1
 */
export function verifySuccessSignature(params: {
  outSum: string;
  invId: string;
  signature: string;
}) {
  const expected = md5(
    `${params.outSum}:${params.invId}:${PASSWORD1}`
  ).toLowerCase();
  return expected === params.signature.toLowerCase();
}
