import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Response("Unauthorized", { status: 401 });

  await supabase.from("notifications").update({ is_read: true }).eq("receiver_id", user.id);

  return new Response("OK");
}
