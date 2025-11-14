import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { id } = await req.json();

  await supabase.from("notifications").update({ is_read: true }).eq("id", id);

  return new Response("OK");
}
