"use client";
import type { SearchTag } from "./types";

export default function SearchTagItem({ tag }: { tag: SearchTag }) {
  return (
    <article className="p-4 rounded-2xl bg-white border border-slate-200">
      <span className="px-3 py-1 rounded-2xl bg-slate-100 text-slate-700 text-sm">
        #{tag.content}
      </span>
    </article>
  );
}
