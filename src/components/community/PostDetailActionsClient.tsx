"use client";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import Button from "@/components/common/Button";
import { Heart, MessageCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { toast } from "sonner";
import { useUserId } from "@/store/useStore";
import { Like } from "@/types/database";

export default function PostDetailActionsClient({
  postId,
  writerId,
  initialLike,
  initialLikeCount,
  commentsCount,
}: {
  postId: string;
  writerId: string;
  initialLike: Pick<Like, "post_id" | "user_id">[];
  initialLikeCount: number;
  commentsCount: number;
}) {
  const supabase = createClient();
  const router = useRouter();
  const userId = useUserId();

  const [liked, setLiked] = useState<boolean>(
    initialLike.some((like) => like.user_id === userId) ?? false,
  );
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount);

  const likeHandler = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!userId) {
      toast.warning("로그인 후에 좋아요를 남기실 수 있습니다.");
      return;
    }

    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    debouncedApiCall();
  };

  const deleteHandler = async () => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      toast.error("게시물 삭제에 실패했습니다. 다시 시도해주세요.");
      return;
    }
    router.push("/community");
    toast.success("게시물이 삭제되었습니다.");
  };

  const debouncedApiCall = useDebouncedCallback(async () => {
    if (!userId) {
      toast.warning("로그인 후에 좋아요를 남기실 수 있습니다.");
      return;
    }

    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", userId)
        .eq("post_id", postId)
        .is("comment_id", null);
    } else {
      // 좋아요 추가
      await supabase.from("likes").insert({ post_id: postId, user_id: userId, comment_id: null });
      // 본인이 작성한 글이 아닐 때만 좋아요 알림
      if (writerId !== userId) {
        await supabase.from("notifications").insert({
          post_id: postId,
          sender_id: userId,
          receiver_id: writerId,
          type: "like",
          is_read: false,
        });
      }
    }
  }, 500);

  return (
    <div className="flex justify-between border-t border-slate-200 pt-5 dark:border-[#364153]">
      <div className="flex gap-5">
        <Button onClick={likeHandler}>
          <Heart
            size={18}
            className={twMerge(
              "transition-transform active:scale-125 stroke-slate-300 fill-slate-300 dark:stroke-[#b2b7c2] dark:fill-[#b2b7c2]",
              liked && "stroke-red-500 fill-red-500 dark:stroke-red-500 dark:fill-red-500",
            )}
          />
          {likeCount}
        </Button>
        <Button>
          <MessageCircle
            size={16}
            className="stroke-slate-300 fill-slate-300 dark:stroke-[#b2b7c2] dark:fill-[#b2b7c2]"
          />
          {commentsCount}
        </Button>
      </div>
      {userId === writerId && (
        <div className="flex gap-2">
          <Button variant="edit" onClick={() => router.push(`/write?post_id=${postId}`)}>
            수정
          </Button>
          <ConfirmDialog
            title="게시글 삭제"
            description="정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
            trigger={<Button variant="delete">삭제</Button>}
            onConfirm={deleteHandler}
          />
        </div>
      )}
    </div>
  );
}
