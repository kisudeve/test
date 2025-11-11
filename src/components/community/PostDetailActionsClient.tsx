"use client";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import Button from "@/components/common/Button";
import { Heart, MessageCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

export default function PostDetailActionsClient({
  postId,
  userId,
  initialLiked,
  initialLikeCount,
  commentsCount,
}: {
  postId: string;
  userId: string | undefined;
  initialLiked: boolean;
  initialLikeCount: number;
  commentsCount: number;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount);

  const likeHandler = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!userId) {
      alert("로그인 후 사용하세요.");
      return;
    }

    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    debouncedApiCall();
  };

  const deleteHandler = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();

    const confirmDelete = confirm("정말로 이 게시물을 삭제하시겠습니까?");
    if (!confirmDelete) {
      return;
    }
    await supabase.from("posts").delete().eq("id", postId);

    router.push("/community");
  };

  const debouncedApiCall = useDebouncedCallback(async () => {
    if (userId && liked) {
      await supabase.from("likes").delete().eq("user_id", userId).eq("post_id", postId);
    } else {
      await supabase.from("likes").insert({ post_id: postId, user_id: userId });
    }
  }, 500);

  return (
    <div className="flex justify-between border-t border-slate-200 pt-5">
      <div className="flex gap-5">
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
        <Button>
          <MessageCircle size={16} className="stroke-slate-300 fill-slate-300" />
          {commentsCount}
        </Button>
      </div>
      {userId && (
        <div className="flex gap-2">
          <Button variant="edit" onClick={() => router.push(`/write?post_id=${postId}`)}>
            수정
          </Button>
          <Button variant="delete" onClick={deleteHandler}>
            삭제
          </Button>
        </div>
      )}
    </div>
  );
}
