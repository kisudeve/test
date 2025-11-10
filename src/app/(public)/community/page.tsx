import { createClient } from "@/utils/supabase/server";
import { PAGE_SIZE } from "@/utils/helpers";
import PostListClient from "@/components/community/PostListClient";

export default async function Page() {
  const supabase = await createClient();

  // 초기 포스트 목록
  const { data: posts, error: listError } = await supabase
    .from("posts")
    .select("*, users(display_name, image_url), feels(type), likes(post_id)")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(0, PAGE_SIZE - 1);

  if (listError || !posts) {
    return null;
  }

  // 사용자 아이디 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <PostListClient initialPosts={posts} userId={user?.id} />;
}
