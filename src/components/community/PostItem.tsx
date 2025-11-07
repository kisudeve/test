"use client";

import { Heart, MessageCircle, Minus, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import { formatRelativeTime } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { CommunityPost } from "@/types/community";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

export default function PostItem({
  post,
  userId,
}: {
  post: CommunityPost;
  userId: string | undefined;
}) {
  const supabase = createClient();
  const [liked, setLiked] = useState<boolean>(post.likes.length > 0);

  const likeHandler = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!userId) {
      alert("로그인 후 사용하세요.");
      return;
    }

    setLiked((prev) => !prev);
    debouncedApiCall();
  };

  const debouncedApiCall = useDebouncedCallback(async () => {
    if (userId && liked) {
      await supabase.from("likes").delete().eq("user_id", userId).eq("post_id", post.id);
    } else {
      await supabase.from("likes").insert({ post_id: post.id, user_id: userId });
    }
  }, 1000);

  return (
    <article className="p-5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white border border-slate-200">
      <Link href={`/community/${post.id}`}>
        <div className="flex gap-4 pb-5">
          {/* 사용자 프로필 사진 */}
          <div className="w-12 h-12">
            <Image
              src={post.users.image_url || ""}
              width={48}
              height={48}
              alt={`${post.users.display_name}님의 프로필 이미지`}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {/* 사용자 닉네임, 작성시간, 글 타입 */}
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center gap-4">
                <strong className="font-medium text-slate-800">{post.users.display_name}</strong>
                <span className="text-slate-400">{formatRelativeTime(post.created_at)}</span>
              </div>
              {post.feels[0].type === "up" && (
                <div className="flex justify-center items-center gap-1 px-3 py-1 bg-red-200 font-medium text-red-500 rounded-2xl">
                  <TrendingUp size={20} />
                  <span>UP</span>
                </div>
              )}
              {post.feels[0].type === "down" && (
                <div className="flex justify-center items-center gap-1 px-3 py-1 bg-blue-200 font-medium text-blue-500 rounded-2xl">
                  <TrendingDown size={20} />
                  <span>DOWN</span>
                </div>
              )}
              {post.feels[0].type === "hold" && (
                <div className="flex justify-center items-center gap-1 px-3 py-1 bg-slate-200 font-medium text-slate-500 rounded-2xl">
                  <Minus size={20} />
                  <span>HOLD</span>
                </div>
              )}
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
          <button
            className="flex items-center gap-1 font-medium text-sm text-slate-500 cursor-pointer hover:opacity-70"
            onClick={likeHandler}
          >
            <Heart
              size={18}
              className={twMerge(
                "transition-transform active:scale-125",
                liked ? "stroke-red-500 fill-red-500" : "stroke-slate-300 fill-slate-300",
              )}
            />
            {post.likes_count}
          </button>
          <button className="flex items-center gap-1 font-medium text-sm text-slate-500 cursor-pointer hover:opacity-70">
            <MessageCircle size={16} className="stroke-slate-300 fill-slate-300" />
            {post.comments_count}
          </button>
        </div>
      </Link>
    </article>
  );
}
