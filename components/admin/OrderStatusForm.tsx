"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { OrderStatus } from "@/lib/types";
import { ORDER_STATUSES } from "@/lib/order-status";

export default function OrderStatusForm({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const router = useRouter();
  const supabase = createClient();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(newStatus: OrderStatus) {
    setValue(newStatus);
    setSaving(true);
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <select
        className="input-field w-auto"
        value={value}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      {saving && <span className="text-sm text-leather-500">Сохраняем…</span>}
    </div>
  );
}
