import { twMerge } from "tailwind-merge";
import ProfileImage from "../common/ProfileImage";
import Link from "next/link";
import { formatRelativeTime } from "@/utils/helpers";
import Button from "../common/Button";
import { Heart } from "lucide-react";
import ConfirmDialog from "../common/ConfirmDialog";
import { CommunityComment } from "@/types/community";
import { Like, User } from "@/types/database";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

export default function CommentChildClient({
  child,
  profile,
  onEdit,
  deleteHandler,
  setIsReplying,
  initialLikeC,
}: {
  child: CommunityComment;
  profile: User | null;
  onEdit: (commentId: string) => void;
  deleteHandler: () => Promise<void>;
  setIsReplying: () => void;
  initialLikeC: Array<Pick<Like, "post_id" | "user_id" | "comment_id">>;
}) {
  const supabase = createClient();

  const [liked, setLiked] = useState<boolean>(
    initialLikeC.some((like) => like.user_id === profile?.id) ?? false,
  );
  const [likeCount, setLikeCount] = useState<number>(child.likes.length);

  // 답글 수정
  const editHandler = () => {
    onEdit(child.id);
    setIsReplying();
  };

  // 답글 좋아요
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
          .eq("post_id", child.post_id)
          .eq("comment_id", child.id);
      } else {
        // 좋아요 추가
        await supabase
          .from("likes")
          .insert({ post_id: child.post_id, user_id: profile.id, comment_id: child.id });
        // 본인이 작성한 글이 아닐 때만 좋아요 알림
        if (child.user_id !== profile.id) {
          await supabase.from("notifications").insert({
            post_id: child.post_id,
            sender_id: profile.id,
            receiver_id: child.user_id,
            comment_id: child.id,
            type: "like",
            is_read: false,
          });
        }
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);
      // 에러 발생 시 UI 상태 롤백
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
      toast.error("좋아요 처리 중 문제가 발생했습니다.");
    }
  }, 500);

  return (
    <li className="relative pl-16 after:w-10 after:h-3 after:absolute after:left-6 after:top-3 after:border-l after:border-b after:rounded-bl-4xl after:border-slate-200 last-of-type:before:absolute last-of-type:before:w-px last-of-type:before:h-[calc(100%-15px)] last-of-type:before:bg-white last-of-type:before:left-6 last-of-type:before:bottom-0">
      <div className="flex gap-4">
        <Link href={`/profile/${child.user_id}`}>
          <ProfileImage
            displayName={child.users.display_name}
            imageUrl={child.users.image_url}
            size="md"
          />
        </Link>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <div className="flex items-center gap-2">
              <strong className="text-md font-semibold text-slate-800">
                {child.users.display_name}
              </strong>
              <span className="text-slate-400 text-xs">{formatRelativeTime(child.created_at)}</span>
            </div>
            {child.user_id === profile?.id && (
              <>
                <div className="flex gap-1">
                  <Button variant="edit" onClick={editHandler}>
                    수정
                  </Button>
                  <ConfirmDialog
                    title="답글 삭제"
                    description="정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                    trigger={<Button variant="delete">삭제</Button>}
                    onConfirm={deleteHandler}
                  />
                </div>
              </>
            )}
          </div>
          <p>{child.content}</p>
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
          </div>
        </div>
      </div>
    </li>
  );
}
