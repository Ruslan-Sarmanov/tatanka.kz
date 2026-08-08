"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCartStore();
  const supabase = createClient();

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setContactEmail(data.user.email);
    });
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Корзина пуста");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        contactName,
        contactPhone,
        contactEmail,
        city,
        address,
        comment,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Не удалось оформить заказ");
      return;
    }

    clear();
    router.push(`/checkout/payment?order=${data.orderId}`);
  }

  return (
    <div className="container-page py-12">
      <h1 className="mb-6 font-display text-3xl text-leather-800">Оформление заказа</h1>

      <div className="grid gap-10 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm text-leather-700">Имя получателя</label>
            <input className="input-field" value={contactName} onChange={(e) => setContactName(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm text-leather-700">Телефон</label>
            <input className="input-field" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm text-leather-700">Email</label>
            <input type="email" className="input-field" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm text-leather-700">Город</label>
            <input className="input-field" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm text-leather-700">Адрес доставки</label>
            <input className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm text-leather-700">Комментарий к заказу</label>
            <textarea className="input-field" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Оформляем…" : "Перейти к оплате"}
          </button>
        </form>

        <div className="card h-fit p-6">
          <h2 className="mb-4 text-lg font-medium text-leather-800">Ваш заказ</h2>
          <ul className="space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between">
                <span>{i.name} × {i.quantity}</span>
                <span>{(i.price * i.quantity).toLocaleString("ru-RU")} ₸</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-right text-lg font-semibold">
            Итого: {total().toLocaleString("ru-RU")} ₸
          </p>
        </div>
      </div>
    </div>
  );
}
