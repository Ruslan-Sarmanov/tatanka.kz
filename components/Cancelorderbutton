"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    if (!confirm("Отменить этот заказ? Это действие нельзя отменить.")) return;
    setLoading(true);
    const { error } = await supabase.rpc("cancel_own_order", { p_order_id: orderId });
    setLoading(false);
    if (error) {
      alert(`Не удалось отменить заказ: ${error.message}`);
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleCancel}
      disabled={loading}
      className="text-sm text-red-600 underline hover:text-red-700 disabled:opacity-50"
    >
      {loading ? "Отменяем…" : "Отменить заказ"}
    </button>
  );
}
