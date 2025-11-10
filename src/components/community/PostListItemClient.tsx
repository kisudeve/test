"use client";

import { Heart, MessageCircle } from "lucide-react";
import { formatRelativeTime } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { CommunityPost, FeelType } from "@/types/community";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import Button from "@/components/common/Button";
import ProfileImage from "@/components/common/ProfileImage";
import FeelBadge from "@/components/common/FeelBadge";

export default function PostListItemClient({
  post,
  userId,
}: {
  post: CommunityPost;
  userId: string | undefined;
}) {
  const supabase = createClient();
  const [liked, setLiked] = useState<boolean>(post.likes.length > 0);
  const [likeCount, setLikeCount] = useState<number>(post.likes_count as number);

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

  const debouncedApiCall = useDebouncedCallback(async () => {
    if (userId && liked) {
      await supabase.from("likes").delete().eq("user_id", userId).eq("post_id", post.id);
    } else {
      await supabase.from("likes").insert({ post_id: post.id, user_id: userId });
      // 본인이 작성한 글이 아닐 때만 좋아요 알림
      if (post.user_id !== userId) {
        await supabase.from("notifications").insert({
          post_id: post.id,
          sender_id: userId,
          receiver_id: post.user_id,
          type: "like",
          is_read: false,
        });
      }
    }
  }, 500);

  return (
    <article className="p-5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white border border-slate-200">
      <Link href={`/community/${post.id}`}>
        <div className="flex gap-4 pb-5">
          {/* 사용자 프로필 사진 */}
          <ProfileImage displayName={post.users.display_name} imageUrl={post.users.image_url} />
          <div className="flex-1 flex flex-col gap-4">
            {/* 사용자 닉네임, 작성시간, 글 타입 */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <strong className="font-semibold text-slate-800">{post.users.display_name}</strong>
                <span className="text-slate-400 text-xs">
                  {formatRelativeTime(post.created_at)}
                </span>
              </div>
              {/* <FeelBadge type={post.feels.type} /> */}
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold">{post.title}</h3>
              <p className="line-clamp-1 font-medium text-slate-700">{post.content}</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded-2xl bg-slate-200 text-xs text-slate-600">
                #해시
              </span>
              <span className="px-2 py-1 rounded-2xl bg-slate-200 text-xs text-slate-600">
                #해시
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-5 border-t border-slate-200 pt-5">
          <Button onClick={likeHandler}>
            <Heart
              size={18}
              className={twMerge(
                "transition-transform active:scale-125",
                liked ? "stroke-red-500 fill-red-500" : "stroke-slate-300 fill-slate-300",
              )}
            />
            {likeCount ?? "0"}
          </Button>
          <Button>
            <MessageCircle size={16} className="stroke-slate-300 fill-slate-300" />
            {post.comments_count ?? "0"}
          </Button>
        </div>
      </Link>
    </article>
  );
}
