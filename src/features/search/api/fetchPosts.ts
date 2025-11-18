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

// 검색 페이지에서 쓸 함수: posts + likes 같이 가져오기
export type PostLikeRow = {
  post_id: string;
  user_id: string;
};

export async function fetchPostsWithLikes(
  limit = 100,
): Promise<{ posts: DBPostRow[]; likes: PostLikeRow[] }> {
  const supabase = createClient();

  const [{ data: postsData, error: postsErr }, { data: likesData, error: likesErr }] =
    await Promise.all([
      supabase
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
        .limit(limit),
      supabase.from("likes").select("post_id, user_id"),
    ]);

  if (postsErr) throw postsErr;
  if (likesErr) throw likesErr;

  return {
    posts: (postsData ?? []) as unknown as DBPostRow[],
    likes: (likesData ?? []) as PostLikeRow[],
  };
}
