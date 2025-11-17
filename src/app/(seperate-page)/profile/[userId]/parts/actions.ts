"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/** 로그아웃 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/sign-in");
}

/** 팔로우/언팔로우 토글 */
export async function followToggle(targetUserId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id === targetUserId) return;

  // 이미 팔로우 했는지 확인
  const { data: rel } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .maybeSingle();

  if (rel) {
    await supabase.from("follows").delete().eq("id", rel.id);
  } else {
    await supabase.from("follows").insert({
      follower_id: user.id,
      following_id: targetUserId,
    });
  }
  
}
