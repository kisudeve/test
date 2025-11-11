import type { DBPostRow } from "../types/db";
import type { CommunityPost } from "@/components/search/types";
import type { FeelType } from "@/components/search/types";

const toFeelType = (v: string | null | undefined): FeelType => {
  const u = (v ?? "HOLD").toUpperCase();
  if (u === "UP" || u === "DOWN" || u === "HOLD") return u as FeelType;
  return "HOLD";
};

export const mapRowToCommunityPost = (r: DBPostRow): CommunityPost => ({
  id: r.id,
  created_at: r.created_at,
  title: r.title ?? "",
  content: r.content ?? "",
  likes_count: r.likes_count ?? 0,
  comments_count: r.comments_count ?? 0,
  users: {
    display_name: r.users?.display_name ?? "알 수 없음",
    image_url: r.users?.image_url ?? null,
  },
  feels: (r.feels ?? []).map((f) => ({ type: toFeelType(f.type) })),
  tags: (r.hashtags ?? []).map((h) => h.content),
  likes: [],
});
