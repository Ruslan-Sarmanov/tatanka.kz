import { orderStatusLabel } from "@/lib/order-status";
import type { OrderStatus } from "@/lib/types";

// Цвет для каждого статуса — чтобы завершённые/отменённые заказы визуально
// не путались с активными в списке, где строки иначе выглядят одинаково.
const STATUS_STYLES: Record<OrderStatus, string> = {
  new: "bg-leather-100 text-leather-600",
  awaiting_payment: "bg-amber-100 text-amber-700",
  paid: "bg-red-100 text-red-700",
  in_production: "bg-indigo-100 text-indigo-700",
  shipped: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-leather-100 text-leather-400 line-through decoration-1",
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status as OrderStatus] ?? "bg-leather-100 text-leather-600";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {orderStatusLabel(status)}
    </span>
  );
}
