"use client";

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function togglePostLike(postId: string, isLiked: boolean) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("[togglePostLike] no user", userError);
    throw new Error("로그인이 필요합니다.");
  }

  if (!isLiked) {
    const { error } = await supabase.from("likes").insert({
      post_id: postId,
      user_id: user.id,
    });
    if (error && error.code !== "23505") throw error;
  } else {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .is("comment_id", null);
    if (error) throw error;
  }
}
