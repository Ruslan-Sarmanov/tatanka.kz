import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getServerDictionary } from "@/lib/i18n/server";

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
  const t = getServerDictionary();
  const [{ data: settings }, { data: userData }] = await Promise.all([
    supabase.from("store_settings").select("*").eq("id", 1).single(),
    supabase.auth.getUser(),
  ]);

  const isLoggedIn = !!userData?.user;

  return (
    <div className="container-page py-12 md:py-16">
      <span className="eyebrow">{t.contact.eyebrow}</span>
      <h1 className="mt-1.5 font-display text-3xl text-ink md:text-4xl">{t.contact.title}</h1>
      <div className="stitch-line mt-6 w-16" />

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="card space-y-4 p-6">
          {settings?.contact_phone && (
            <div>
              <p className="text-sm text-leather-500">{t.contact.phone}</p>
              <a href={`tel:${digitsOnly(settings.contact_phone)}`} className="text-lg font-medium hover:text-saddle-500">
                {settings.contact_phone}
              </a>
            </div>
          )}
          {settings?.whatsapp && (
            <div>
              <p className="text-sm text-leather-500">{t.contact.whatsapp}</p>
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
              <p className="text-sm text-leather-500">{t.contact.email}</p>
              <a href={`mailto:${settings.contact_email}`} className="text-lg font-medium hover:text-saddle-500">
                {settings.contact_email}
              </a>
            </div>
          )}
          {(settings?.city || settings?.address) && (
            <div>
              <p className="text-sm text-leather-500">{t.contact.address}</p>
              <p className="text-lg font-medium">
                {[settings?.city, settings?.address].filter(Boolean).join(", ")}
              </p>
            </div>
          )}
          {settings?.working_hours && (
            <div>
              <p className="text-sm text-leather-500">{t.contact.workingHours}</p>
              <p className="text-lg font-medium">{settings.working_hours}</p>
            </div>
          )}
          {!settings?.contact_phone &&
            !settings?.whatsapp &&
            !settings?.contact_email &&
            !settings?.address && (
              <p className="text-sm text-leather-500">{t.contact.comingSoon}</p>
            )}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-medium text-leather-800">{t.contact.questionTitle}</h2>
          <p className="mt-2 text-sm text-leather-600">
            {t.contact.questionText}
          </p>
          {isLoggedIn ? (
            <Link href="/account?tab=feedback" className="btn-primary mt-5 inline-flex">
              {t.contact.writeInCabinet}
            </Link>
          ) : (
            <Link href={`/login?next=${encodeURIComponent("/account?tab=feedback")}`} className="btn-primary mt-5 inline-flex">
              {t.contact.loginAndWrite}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
