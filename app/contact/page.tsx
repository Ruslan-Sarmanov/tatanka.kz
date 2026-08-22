import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Свяжитесь с TATANKA.KZ — телефон, WhatsApp, email и адрес.",
  alternates: { canonical: "/contact" },
};

function digitsOnly(s: string) {
  return s.replace(/[^\d+]/g, "");
}

export default async function ContactPage() {
  const supabase = createClient();
  const [{ data: settings }, { data: userData }] = await Promise.all([
    supabase.from("store_settings").select("*").eq("id", 1).single(),
    supabase.auth.getUser(),
  ]);

  const isLoggedIn = !!userData?.user;

  return (
    <div className="container-page py-12 md:py-16">
      <span className="eyebrow">Связаться с нами</span>
      <h1 className="mt-1.5 font-display text-3xl text-ink md:text-4xl">Контакты</h1>
      <div className="stitch-line mt-6 w-16" />

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="card space-y-4 p-6">
          {settings?.contact_phone && (
            <div>
              <p className="text-sm text-leather-500">Телефон</p>
              <a href={`tel:${digitsOnly(settings.contact_phone)}`} className="text-lg font-medium hover:text-saddle-500">
                {settings.contact_phone}
              </a>
            </div>
          )}
          {settings?.whatsapp && (
            <div>
              <p className="text-sm text-leather-500">WhatsApp</p>
              <a
                href={`https://wa.me/${digitsOnly(settings.whatsapp).replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium hover:text-saddle-500"
              >
                {settings.whatsapp}
              </a>
            </div>
          )}
          {settings?.contact_email && (
            <div>
              <p className="text-sm text-leather-500">Email</p>
              <a href={`mailto:${settings.contact_email}`} className="text-lg font-medium hover:text-saddle-500">
                {settings.contact_email}
              </a>
            </div>
          )}
          {(settings?.city || settings?.address) && (
            <div>
              <p className="text-sm text-leather-500">Адрес</p>
              <p className="text-lg font-medium">
                {[settings?.city, settings?.address].filter(Boolean).join(", ")}
              </p>
            </div>
          )}
          {settings?.working_hours && (
            <div>
              <p className="text-sm text-leather-500">Часы работы</p>
              <p className="text-lg font-medium">{settings.working_hours}</p>
            </div>
          )}
          {!settings?.contact_phone &&
            !settings?.whatsapp &&
            !settings?.contact_email &&
            !settings?.address && (
              <p className="text-sm text-leather-500">Контактные данные скоро появятся здесь.</p>
            )}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-medium text-leather-800">Есть вопрос по заказу?</h2>
          <p className="mt-2 text-sm text-leather-600">
            Быстрее всего мы ответим в переписке в личном кабинете — там же видна вся история
            по вашим заказам.
          </p>
          {isLoggedIn ? (
            <Link href="/account" className="btn-primary mt-5 inline-flex">
              Написать в личном кабинете
            </Link>
          ) : (
            <Link href="/login?next=/account" className="btn-primary mt-5 inline-flex">
              Войти и написать
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
