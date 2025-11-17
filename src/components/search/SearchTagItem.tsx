"use client";

import type { SearchTag } from "./types";

export default function SearchTagItem({ tag }: { tag: SearchTag }) {
  return (
    <article className="p-4 rounded-2xl bg-white border border-slate-200">
      <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-50 text-slate-700 text-sm border border-slate-200">
        #{tag.content}
      </span>
    </article>
  );
}
