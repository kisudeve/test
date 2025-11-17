"use client";

import { formatRelativeTime } from "@/utils/helpers";
import ProfileImage from "@/components/common/ProfileImage";
import Button from "@/components/common/Button";
import { twMerge } from "tailwind-merge";
import { Heart } from "lucide-react";
import { CommunityComment } from "@/types/community";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { deleteComment } from "@/utils/actions/comment";
import Link from "next/link";
import { Like, User } from "@/types/database";
import CommentReplyFormClient from "./CommentReplyFormClient";
import { useMemo, useState } from "react";
import CommentChildClient from "./CommentChildClient";
import { toast } from "sonner";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { createClient } from "@/utils/supabase/client";

export default function CommentListItemClient({
  comment,
  childComments,
  profile, // 현재 로그인한 사용자 정보
  onEdit,
  isReplying,
  setIsReplying,
  editingReplyCommentId,
  editingReplyComment,
  cancelEditing,
  onEditReply,
  initialLike,
}: {
  comment: CommunityComment;
  childComments: CommunityComment[];
  profile: User | null;
  onEdit: (commentId: string) => void;
  isReplying: boolean;
  setIsReplying: () => void;
  editingReplyCommentId: string | null;
  editingReplyComment?: string;
  cancelEditing: () => void;
  onEditReply: (replyId: string) => void;
  initialLike: Array<Pick<Like, "post_id" | "user_id" | "comment_id">>;
}) {
  const supabase = createClient();

  const [liked, setLiked] = useState<boolean>(
    initialLike.some((like) => like.user_id === profile?.id) ?? false,
  );
  const [likeCount, setLikeCount] = useState<number>(comment.likes.length);
  const [showChildren, setShowChildren] = useState<boolean>(false);

  const visibleComments = useMemo(
    () => childComments?.filter((c) => c.id !== editingReplyCommentId),
    [editingReplyCommentId, childComments],
  );

  // 답글 목록 토글
  const toggleChildComments = () => {
    setShowChildren((prev) => !prev);
  };

  // 답글 삭제
  const deleteHandler = async () => {
    const result = await deleteComment(comment.post_id, comment.id, comment.parent_id);
    if (result.success) {
      toast.success("답글이 삭제되었습니다.");
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  // 댓글 좋아요
  const likeHandler = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!profile?.id) {
      toast.warning("로그인 후에 좋아요를 남기실 수 있습니다.");
      return;
    }

    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    debouncedApiCall();
  };

  const debouncedApiCall = useDebouncedCallback(async () => {
    if (!profile?.id) return;

    try {
      if (liked) {
        // 좋아요 취소
        await supabase
          .from("likes")
          .delete()
          .eq("user_id", profile.id)
          .eq("post_id", comment.post_id)
          .eq("comment_id", comment.id);
      } else {
        // 좋아요 추가
        await supabase
          .from("likes")
          .insert({ post_id: comment.post_id, user_id: profile.id, comment_id: comment.id });
        // 본인이 작성한 글이 아닐 때만 좋아요 알림
        if (comment.user_id !== profile.id) {
          await supabase.from("notifications").insert({
            type: "like",
            receiver_id: comment.user_id,
            sender_id: profile.id,
            post_id: comment.post_id,
            comment_id: comment.id,
            is_read: false,
          });
        }
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
      toast.error("좋아요 처리 중 문제가 발생했습니다.");
    }
  }, 500);

  return (
    <>
      <article
        key={comment.id}
        className={twMerge(
          "relative",
          childComments.length > 0 &&
            showChildren &&
            "before:w-px before:h-full before:bg-slate-200 before:absolute before:left-6",
        )}
      >
        <div className="flex gap-4 relative">
          <Link href={`/profile/${comment.user_id}`}>
            <ProfileImage
              displayName={comment.users.display_name}
              imageUrl={comment.users.image_url}
              size="md"
            />
          </Link>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <div className="flex items-center gap-2">
                <strong className="text-md font-semibold text-slate-800">
                  {comment.users.display_name}
                </strong>
                <span className="text-slate-400 text-xs">
                  {formatRelativeTime(comment.created_at)}
                </span>
              </div>
              {comment.user_id === profile?.id && (
                <>
                  <div className="flex gap-1">
                    <Button variant="edit" onClick={() => onEdit(comment.id)}>
                      수정
                    </Button>
                    <ConfirmDialog
                      title="댓글 삭제"
                      description="정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                      trigger={<Button variant="delete">삭제</Button>}
                      onConfirm={deleteHandler}
                    />
                  </div>
                </>
              )}
            </div>
            <p>{comment.content}</p>
            <div className="flex gap-2">
              <Button onClick={likeHandler}>
                <Heart
                  size={18}
                  className={twMerge(
                    "transition-transform active:scale-125 stroke-slate-300 fill-slate-300",
                    liked && "stroke-red-500 fill-red-500",
                  )}
                />
                {likeCount}
              </Button>
              <Button onClick={toggleChildComments}>답글 {childComments.length}</Button>
              {profile?.id && <Button onClick={setIsReplying}>답글 달기</Button>}
            </div>
            {isReplying && (
              <CommentReplyFormClient
                postId={comment.post_id}
                parentId={comment.id}
                profile={profile}
                editingReplyCommentId={editingReplyCommentId}
                editingReplyComment={editingReplyComment}
                cancelEditing={cancelEditing}
                setIsReplying={setIsReplying}
              />
            )}
          </div>
        </div>
        {showChildren && visibleComments.length > 0 && (
          <ul className="space-y-6 mt-6">
            {visibleComments.map((child) => (
              <CommentChildClient
                key={child.id}
                child={child}
                profile={profile}
                onEdit={onEditReply}
                deleteHandler={async () => {
                  const result = await deleteComment(child.post_id, child.id, child.parent_id);
                  if (result.success) {
                    toast.success("답글이 삭제되었습니다.");
                  } else if (result.error) {
                    toast.error(result.error);
                  }
                }}
                setIsReplying={setIsReplying}
                initialLikeC={child.likes}
              />
            ))}
          </ul>
        )}
      </article>
    </>
  );
}
