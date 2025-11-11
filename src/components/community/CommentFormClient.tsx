"use client";

import Button from "@/components/common/Button";
import TextArea from "@/components/common/TextArea";
import { insertComment, updateComment } from "@/utils/actions/comment";
import { useActionState, useCallback, useEffect, useRef } from "react";
import Input from "@/components/common/Input";
import { User } from "@/types/database";
import ProfileImage from "@/components/common/ProfileImage";
import { useRouter } from "next/navigation";

export default function CommentFormClient({
  profile,
  postId,
  editingCommentId,
  editingComment,
  cancelEditing,
}: {
  profile: User | null;
  postId: string;
  editingCommentId: string | null;
  editingComment: string | undefined;
  cancelEditing: () => void;
}) {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = !!editingCommentId;

  const [state, action, pending] = useActionState(isEditing ? updateComment : insertComment, {
    success: false,
    error: null,
  });

  const handleCancel = useCallback(() => {
    cancelEditing();
    formRef.current?.reset();
    router.refresh();
  }, [cancelEditing, router]);

  // 수정모드
  useEffect(() => {
    if (isEditing) {
      formRef.current!.comment!.focus();
      formRef.current!.comment!.value = editingComment || "";
    }
  }, [isEditing, editingComment]);

  // state 변경 시 콘솔 출력
  useEffect(() => {
    if (state?.error) {
      console.error("Error:", state.error);
    }

    if (state?.success) {
      console.log("댓글이 등록되었습니다.");
      handleCancel();
    }
  }, [state, pending, handleCancel]);

  return (
    <>
      {!profile && <p>회원만 댓글 작성 권한이 있습니다.</p>}
      {profile && (
        <>
          <div className="flex gap-3">
            <ProfileImage
              displayName={profile?.display_name}
              imageUrl={profile?.image_url}
              size="md"
            />
            <div className="flex-1">
              <form ref={formRef} action={action}>
                <fieldset className="flex gap-2">
                  <legend className="hidden">댓글 등록</legend>
                  <Input type="hidden" name="postId" value={postId} />
                  {editingCommentId && (
                    <Input type="hidden" name="commentId" value={editingCommentId} />
                  )}
                  <TextArea
                    name="comment"
                    className="w-full h-20"
                    placeholder="댓글을 입력하세요..."
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
      )}
    </>
  );
}
