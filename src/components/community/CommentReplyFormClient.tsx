"use client";

import { User } from "@/types/database";
import ProfileImage from "../common/ProfileImage";
import { useActionState, useCallback, useEffect, useRef } from "react";
import { insertComment, updateComment } from "@/utils/actions/comment";
import { useRouter } from "next/navigation";
import Input from "../common/Input";
import TextArea from "../common/TextArea";
import { toast } from "sonner";
import Button from "../common/Button";

export default function CommentReplyFormClient({
  postId,
  parentId,
  profile,
  editingReplyCommentId,
  editingReplyComment,
  cancelEditing,
  setIsReplying,
}: {
  postId: string;
  parentId: string;
  profile: User | null;
  editingReplyCommentId: string | null;
  editingReplyComment: string | undefined;
  cancelEditing: () => void;
  setIsReplying: () => void;
}) {
  const router = useRouter();
  const prevPendingRef = useRef(false); // 이전 pending 상태 추적
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = !!editingReplyCommentId;

  const [state, action, pending] = useActionState(isEditing ? updateComment : insertComment, {
    success: false,
    error: null,
  });

  const handleCancel = useCallback(() => {
    formRef.current?.reset();
    if (isEditing) {
      cancelEditing();
      setIsReplying();
    }
    router.refresh();
  }, [router, isEditing, cancelEditing, setIsReplying]);

  // 수정 모드 진입 시 기존 내용 폼에 채우기
  useEffect(() => {
    if (!isEditing) return;

    formRef.current!.comment!.focus();
    formRef.current!.comment!.value = editingReplyComment || "";
  }, [isEditing, editingReplyComment]);

  useEffect(() => {
    const wasPending = prevPendingRef.current;
    const nowPending = !!pending;

    if (wasPending && !nowPending) {
      if (state?.error) {
        toast.error(state.error || "답글 처리 중 문제가 발생했습니다.");
      } else if (state?.success) {
        // 성공 분기
        if (isEditing) {
          toast.success("답글이 수정되었습니다.");
          cancelEditing();
          setIsReplying();
          setTimeout(() => router.refresh(), 0);
        } else {
          toast.success("답글이 등록되었습니다.");
          formRef.current?.reset();
          setIsReplying();
          setTimeout(() => router.refresh(), 0);
        }
      }
    }

    prevPendingRef.current = nowPending;
  }, [pending, state, isEditing, cancelEditing, router, setIsReplying]);

  return (
    <>
      <div className="flex gap-3 mt-6">
        <ProfileImage displayName={profile?.display_name} imageUrl={profile?.image_url} size="md" />
        <div className="flex-1">
          <form ref={formRef} action={action}>
            <fieldset className="flex gap-2">
              <legend className="hidden">대댓글 등록</legend>
              <Input type="hidden" name="postId" value={postId} />
              <Input type="hidden" name="parentId" value={parentId} />
              {editingReplyCommentId && (
                <Input type="hidden" name="commentId" value={editingReplyCommentId} />
              )}
              <TextArea
                name="comment"
                className="w-full h-20"
                placeholder="답글을 입력하세요..."
                disabled={pending}
              />
              {!isEditing && (
                <Button type="submit" className="w-30" variant="submit" disabled={pending}>
                  {pending ? "등록중..." : "작성"}
                </Button>
              )}
              {isEditing && (
                <div className="flex flex-col gap-1">
                  <Button
                    type="submit"
                    className="flex-1 w-30 min-h-0 py-1 rounded-lg"
                    variant="submit"
                    disabled={pending}
                  >
                    {pending ? "수정중..." : "수정"}
                  </Button>
                  <Button
                    className="flex-1"
                    variant="edit"
                    onClick={handleCancel}
                    disabled={pending}
                  >
                    취소
                  </Button>
                </div>
              )}
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
}
