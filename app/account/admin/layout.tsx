import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

// Middleware уже блокирует доступ не-админам, здесь — повторная проверка
// на случай прямого использования компонента вне middleware.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 bg-leather-50 p-5 md:p-8">{children}</div>
    </div>
  );
}
