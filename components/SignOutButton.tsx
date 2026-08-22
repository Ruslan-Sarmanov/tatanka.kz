"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/components/i18n/LangProvider";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();
  const { dict } = useLang();

  return (
    <button
      className="btn-secondary"
      onClick={async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      {dict.account.signOut}
    </button>
  );
}
