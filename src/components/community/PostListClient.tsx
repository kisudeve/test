"use client";

import { CommunityPost } from "@/types/community";
import PostItem from "./PostItem";
import { useCallback, useEffect, useRef, useState } from "react";
import { PAGE_SIZE } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/client";

export default function PostListClient({
  initialPosts,
  userId,
}: {
  initialPosts: CommunityPost[];
  userId: string | undefined;
}) {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const oTarget = useRef(null);
  const page = useRef(PAGE_SIZE);

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const supabase = createClient();

    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("*, users(display_name, image_url), feels(type), likes(post_id)")
      .order("created_at", { ascending: false })
      .range(page.current, page.current + PAGE_SIZE - 1);

    if (!posts || postsError) {
      alert("포스트 로딩에 실패했습니다.");
      setLoading(false);
      return;
    }

    if (posts.length > 0) {
      page.current += PAGE_SIZE;
      setPosts((prev) => [...prev, ...posts]);

      if (posts.length < PAGE_SIZE) setHasMore(false);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  }, [hasMore, loading]);

  useEffect(() => {
    if (!oTarget.current) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMorePosts();
        }
      },
      { rootMargin: "200px" }, // 200px 일찍 감지
    );

    obs.observe(oTarget.current);
  }, [hasMore, loading, loadMorePosts]);

  return (
    <section className="flex flex-col gap-4 m-8">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} userId={userId} />
      ))}

      {hasMore && <div ref={oTarget}>{loading && <p>로딩중</p>}</div>}
    </section>
  );
}
