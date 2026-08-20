import type { OrderStatus } from "@/lib/types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Новый",
  awaiting_payment: "Ожидает оплаты",
  paid: "Оплачен",
  in_production: "В изготовлении",
  shipped: "Отправлен",
  completed: "Завершён",
  cancelled: "Отменён",
};

// Для выпадающих списков (например, смена статуса в админке) — тот же
// набор, но в виде массива { value, label }.
export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = (
  Object.entries(ORDER_STATUS_LABELS) as [OrderStatus, string][]
).map(([value, label]) => ({ value, label }));

export function orderStatusLabel(status: string) {
  return ORDER_STATUS_LABELS[status as OrderStatus] ?? status;
}
