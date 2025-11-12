"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";
import Button from "@/components/common/Button";
import ProfileImage from "@/components/common/ProfileImage";
import FeelBadge from "@/components/common/FeelBadge";
import { CommunityPost } from "./types";
import type { FeelType as CoreFeelType } from "@/types/community";

// 간단한 상대시간 헬퍼(추후 utils로 교체 가능)
function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / (1000 * 60 * 60));
  if (h <= 0) return "방금 전";
  return `${h}시간 전`;
}

export default function SearchPostItem({ post }: { post: CommunityPost }) {
  const [liked, setLiked] = useState<boolean>(post.likes.length > 0);
  const [likeCount, setLikeCount] = useState<number>(post.likes_count);

  const likeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    // TODO: supabase 연동 시 API 호출 연결
  };

  const feel: CoreFeelType = (post.feels?.[0]?.type?.toLowerCase?.() ?? "hold") as CoreFeelType;

  return (
    <article className="p-5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white border border-slate-200">
      <Link href={`/community/${post.id}`}>
        <div className="flex gap-4 pb-5">
          <ProfileImage displayName={post.users.display_name} imageUrl={post.users.image_url} />
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <strong className="font-semibold text-slate-800">{post.users.display_name}</strong>
                <span className="text-slate-400 text-xs">
                  {formatRelativeTime(post.created_at)}
                </span>
              </div>
              <FeelBadge type={feel} />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold">{post.title}</h3>
              <p className="line-clamp-1 font-medium text-slate-700">{post.content}</p>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 rounded-2xl bg-slate-200 text-xs text-slate-600"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
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
            {likeCount}
          </Button>
          <Button>
            <MessageCircle size={16} className="stroke-slate-300 fill-slate-300" />
            {post.comments_count}
          </Button>
        </div>
      </Link>
    </article>
  );
}
