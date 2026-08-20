"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type OrderDetails = {
  contact_name: string;
  contact_phone: string;
  delivery_city: string;
  delivery_address: string;
  comment: string | null;
};

export default function EditOrderDetailsForm({
  orderId,
  initial,
}: {
  orderId: string;
  initial: OrderDetails;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState(initial);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: rpcError } = await supabase.rpc("update_own_order_details", {
      p_order_id: orderId,
      p_contact_name: values.contact_name,
      p_contact_phone: values.contact_phone,
      p_delivery_city: values.delivery_city,
      p_delivery_address: values.delivery_address,
      p_comment: values.comment,
    });

    setLoading(false);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm text-saddle-500 underline hover:text-saddle-600">
        Изменить контакты или адрес доставки
      </button>
    );
  }

  return (
    <form onSubmit={handleSave} className="card space-y-3 border-saddle-200 p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-leather-500">Имя получателя</label>
          <input
            className="input-field"
            value={values.contact_name}
            onChange={(e) => setValues({ ...values, contact_name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-leather-500">Телефон</label>
          <input
            className="input-field"
            value={values.contact_phone}
            onChange={(e) => setValues({ ...values, contact_phone: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-leather-500">Город</label>
          <input
            className="input-field"
            value={values.delivery_city}
            onChange={(e) => setValues({ ...values, delivery_city: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-leather-500">Адрес</label>
          <input
            className="input-field"
            value={values.delivery_address}
            onChange={(e) => setValues({ ...values, delivery_address: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-leather-500">Комментарий</label>
        <textarea
          className="input-field"
          rows={2}
          value={values.comment ?? ""}
          onChange={(e) => setValues({ ...values, comment: e.target.value })}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary text-sm">
          {loading ? "Сохраняем…" : "Сохранить изменения"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn-secondary text-sm">
          Отмена
        </button>
      </div>
    </form>
  );
}
