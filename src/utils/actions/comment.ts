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

  // 작성자 정보 가져오기
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", postId)
    .single();

  if (postError) return { success: false, error: "게시글 정보를 가져오는 중 문제가 발생했습니다." };

  // 본인이 작성한 글이 아닐 때만 댓글 알림
  if (post.user_id !== user.id) {
    await supabase.from("notifications").insert([
      {
        receiver_id: post.user_id,
        sender_id: user.id,
        post_id: postId,
        type: "comment",
        is_read: false,
      },
    ]);
  }

  revalidatePath(`/community/${postId}`);

  return { success: true, error: null };
};

export const updateComment = async (
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
  const commentId = formData.get("commentId")?.toString() ?? "";
  const content = formData.get("comment")?.toString() ?? "";

  if (!postId) return { success: false, error: "게시글 ID가 없습니다." };
  if (!commentId) return { success: false, error: "댓글 ID가 없습니다." };
  if (!content || content.trim() === "") return { success: false, error: "댓글을 입력해주세요." };

  const { error: commentError } = await supabase
    .from("comments")
    .update({ content: content.trim() })
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (commentError) return { success: false, error: "댓글 수정 중 문제가 발생했습니다." };

  revalidatePath(`/community/${postId}`);
  return { success: true, error: null };
};

export const deleteComment = async (
  postId: string,
  commentId: string,
  parentId: string | null,
): Promise<FormState> => {
  const supabase = await createClient();

  // 사용자 확인
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  if (parentId) {
    const { error: replyError } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("post_id", postId)
      .eq("parent_id", parentId)
      .eq("user_id", user.id);
    if (replyError) {
      return { success: false, error: "대댓글 삭제 중 문제가 발생했습니다." };
    }

    revalidatePath(`/community/${postId}`);
    return { success: true, error: null };
  }

  const { error: commentError } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("post_id", postId)
    .eq("user_id", user.id);

  if (commentError) {
    return { success: false, error: "댓글 삭제 중 문제가 발생했습니다." };
  }

  revalidatePath(`/community/${postId}`);
  return { success: true, error: null };
};
