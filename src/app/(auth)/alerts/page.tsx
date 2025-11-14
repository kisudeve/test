import AlertsPageClient from "@/components/alerts/AlertsPageClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AlertsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data } = await supabase
    .from("notifications")
    .select(
      `
  id,
  type,
  post_id,
  is_read,
  created_at,
  sender:sender_id (
    id,
    display_name,
    image_url
  )
`,
    )
    .eq("receiver_id", user.id)
    .order("created_at", { ascending: false });

  const notifications = (data ?? []) as unknown as Notification[];

  return <AlertsPageClient notifications={notifications} />;
}
