import { createClient } from "@/utils/supabase/client";
import type { DBUserRow } from "../types/db";

export async function fetchUsers(limit = 100): Promise<DBUserRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, display_name, image_url, bio")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as DBUserRow[];
}
