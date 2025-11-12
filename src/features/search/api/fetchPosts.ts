import { createClient } from "@/utils/supabase/client";
import type { DBPostRow } from "../types/db";

export async function fetchPosts(limit = 100): Promise<DBPostRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id, created_at, title, content, likes_count, comments_count,
      users:users(id, display_name, image_url),
      hashtags:hashtags(content),
      feels(type, amount)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as DBPostRow[];
}
