"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { StoreSettings } from "@/lib/types";

export default function StoreSettingsForm({ settings }: { settings: StoreSettings | null }) {
  const router = useRouter();
  const supabase = createClient();

  const [contactPhone, setContactPhone] = useState(settings?.contact_phone ?? "");
  const [contactEmail, setContactEmail] = useState(settings?.contact_email ?? "");
  const [whatsapp, setWhatsapp] = useState(settings?.whatsapp ?? "");
  const [city, setCity] = useState(settings?.city ?? "");
  const [address, setAddress] = useState(settings?.address ?? "");
  const [workingHours, setWorkingHours] = useState(settings?.working_hours ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    const { error: saveError } = await supabase
      .from("store_settings")
      .update({
        contact_phone: contactPhone.trim() || null,
        contact_email: contactEmail.trim() || null,
        whatsapp: whatsapp.trim() || null,
        city: city.trim() || null,
        address: address.trim() || null,
        working_hours: workingHours.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setLoading(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <h3 className="font-medium text-leather-800">Контакты и адрес</h3>
      <p className="text-sm text-leather-500">
        Эти данные показываются покупателям на странице «Контакты» и в футере сайта.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-leather-700">Телефон</label>
          <input
            className="input-field"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="+7 776 757 76 67"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-leather-700">Email</label>
          <input
            className="input-field"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="hello@tatanka.kz"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-leather-700">WhatsApp</label>
          <input
            className="input-field"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+7 776 757 76 67"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-leather-700">Город</label>
          <input
            className="input-field"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Актобе"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-leather-700">Адрес</label>
        <input
          className="input-field"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Улица, дом (если есть шоурум/точка выдачи)"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-leather-700">Часы работы</label>
        <input
          className="input-field"
          value={workingHours}
          onChange={(e) => setWorkingHours(e.target.value)}
          placeholder="Пн–Сб, 10:00–19:00"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Сохраняем…" : saved ? "Сохранено ✓" : "Сохранить"}
      </button>
    </form>
  );
}
