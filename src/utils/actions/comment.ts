"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { FormState } from "@/types/form";

export const insertComment = async (
  prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const supabase = await createClient();

  // 사용자 확인
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) return { success: false, error: "로그인이 필요합니다." };

  // 데이터 가져오기
  const postId = formData.get("postId")?.toString() ?? "";
  const content = formData.get("comment")?.toString() ?? "";

  if (!postId) return { success: false, error: "게시글 ID가 없습니다." };
  if (!content || content.trim() === "") return { success: false, error: "댓글을 입력해주세요." };

  const { error: commentError } = await supabase
    .from("comments")
    .insert([{ post_id: postId, user_id: user.id, content }]);

  if (commentError) return { success: false, error: "댓글 등록 중 문제가 발생했습니다." };

  revalidatePath(`/community/${postId}`);

  return { success: true, error: null };
};
