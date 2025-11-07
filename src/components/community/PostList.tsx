import PostItem from "./PostItem";
import { createClient } from "@/utils/supabase/server";

export default async function PostList() {
  const supabase = await createClient();

  // 포스트 목록
  const { data: posts, error: listError } = await supabase
    .from("posts")
    .select("*, users(display_name, image_url), feels(type), likes(post_id)")
    .order("created_at", { ascending: false });

  if (listError || !posts) {
    return null;
  }

  // 사용자 아이디 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="flex flex-col gap-4 m-8">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} userId={user?.id} />
      ))}
    </section>
  );
}
