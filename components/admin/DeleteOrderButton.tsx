"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteOrderButton({
  orderId,
  orderNumber,
  redirectTo,
}: {
  orderId: string;
  orderNumber: number;
  // При удалении со страницы деталей заказа нужно уйти со страницы,
  // которой больше не будет — в списке заказов такого не требуется,
  // там просто обновляется список на месте.
  redirectTo?: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Удалить заказ №${orderNumber} безвозвратно? Это действие нельзя отменить.`)) return;

    setLoading(true);
    const { error } = await supabase.from("orders").delete().eq("id", orderId);
    setLoading(false);

    if (error) {
      alert(`Не удалось удалить заказ: ${error.message}`);
      return;
    }

    if (redirectTo) {
      router.push(redirectTo);
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      aria-label="Удалить заказ"
      className="shrink-0 text-sm text-red-600 underline hover:text-red-700 disabled:opacity-50"
    >
      {loading ? "Удаляем…" : "Удалить"}
    </button>
  );
}
