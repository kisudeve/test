"use client";

import clsx from "clsx";

type Props = {
  active: "posts" | "views";
  onChange: (t: "posts" | "views") => void;
  postsCount?: number;
  viewsCount?: number;
};

export default function PostTabs({ active, onChange, postsCount = 0, viewsCount = 0 }: Props) {
  return (
    <div className="inline-flex rounded-full bg-slate-100 p-1 gap-1">
      <button
        type="button"
        onClick={() => onChange("posts")}
        className={clsx(
          "rounded-full px-5 py-2 text-[14px] font-semibold transition",
          active === "posts" ? "bg-white shadow-sm text-slate-900" : "text-slate-600 hover:text-slate-800"
        )}
      >
        작성한 글 <span className="tabular-nums text-slate-400">({postsCount})</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("views")}
        className={clsx(
          "rounded-full px-5 py-2 text-[14px] font-semibold transition",
          active === "views" ? "bg-white shadow-sm text-slate-900" : "text-slate-600 hover:text-slate-800"
        )}
      >
        조회한 글 <span className="tabular-nums text-slate-400">({viewsCount})</span>
      </button>
    </div>
  );
}
