import { createClient } from "@/utils/supabase/client";
import type { DBTagRow } from "../types/db";

export async function fetchTags(limit = 100): Promise<DBTagRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("hashtags")
    .select("content")
    .not("content", "is", null)
    .neq("content", "")
    .limit(1000); // 넉넉히 가져와서 클라이언트에서 중복 제거

  if (error) throw error;
  const all = (data ?? []).map((d) => d.content as string);
  const unique = Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));

  return unique.slice(0, limit).map((content) => ({ content }));
}
