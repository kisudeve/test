"use client";
import Button from "@/components/common/Button";
import TextArea from "@/components/common/TextArea";
import { insertComment } from "@/utils/actions/comment";
import { useActionState, useEffect, useRef } from "react";
import Input from "../common/Input";

export default function CommentFormClient({ postId }: { postId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(insertComment, {
    success: false,
    error: null,
  });

  // state 변경 시 콘솔 출력
  useEffect(() => {
    console.log("📊 Current state:", state);
    console.log("⏳ isPending:", pending);

    if (state?.error) {
      console.error("❌ Error:", state.error);
    }

    if (state?.success) {
      console.log("✅ Success! 댓글이 등록되었습니다.");
      formRef.current?.reset();
    }
  }, [state, pending]);

  return (
    <>
      <div className="flex-1">
        <form ref={formRef} action={action}>
          <fieldset className="flex gap-2">
            <legend className="hidden">댓글 등록</legend>
            <Input type="hidden" name="postId" value={postId} />
            <TextArea
              name="comment"
              className="w-full h-20"
              placeholder="댓글을 입력하세요..."
              disabled={pending}
            />
            <Button type="submit" className="w-30" variant="submit" disabled={pending}>
              {pending ? "등록중..." : "작성"}
            </Button>
          </fieldset>
        </form>
      </div>
    </>
  );
}
