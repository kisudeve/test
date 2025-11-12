"use client";

import { MessageCircle, Eye, Lock } from "lucide-react";

type Tag = { id?: string | number; label: string } | string;

export default function PostCard({
  createdAt,
  visibility,
  content,
  likeCount,
  commentCount,
  tags = [],
}: {
  id?: string | number;
  createdAt: string;
  visibility: "public" | "followers";
  content: string;
  likeCount: number;
  commentCount: number;
  tags?: Tag[];
}) {
  const vis =
    visibility === "public" ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
        <Eye className="h-3.5 w-3.5" /> 공개
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
        <Lock className="h-3.5 w-3.5" /> 팔로워
      </span>
    );

  const d = new Date(createdAt);
  const dateLabel = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md">
      <header className="mb-3 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded bg-rose-100" aria-hidden />
          <span>{dateLabel}</span>
        </div>
        {vis}
      </header>

      <p className="whitespace-pre-wrap text-[15px] leading-6 text-slate-800">
        {content}
      </p>

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t, i) => {
            const label = typeof t === "string" ? t : t.label;
            return (
              <span
                key={typeof t === "string" ? `${t}-${i}` : t.id ?? i}
                className="rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-600"
              >
                {label}
              </span>
            );
          })}
        </div>
      )}

      <footer className="mt-3 flex items-center justify-end gap-4 text-sm text-slate-500">
        <div className="inline-flex items-center gap-1">
          <span className="font-semibold">{likeCount}</span>
          <span>❤</span>
        </div>
        <div className="inline-flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span className="font-semibold">{commentCount}</span>
        </div>
      </footer>
    </article>
  );
}
