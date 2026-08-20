import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BannerForm from "@/components/admin/BannerForm";

export default async function EditBannerPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: banner } = await supabase
    .from("banners")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!banner) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">Редактировать баннер</h1>
      <BannerForm banner={banner} />
    </div>
  );
}
