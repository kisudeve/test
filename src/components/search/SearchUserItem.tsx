"use client";
import ProfileImage from "@/components/common/ProfileImage";
import type { SearchUser } from "./types";

export default function SearchUserItem({ user }: { user: SearchUser }) {
  return (
    <article className="p-5 rounded-2xl bg-white border border-slate-200 shadow-[0_4px_12px_rgba(15,23,42,0.04)] flex gap-3 items-center dark:bg-[#141d2b] dark:border-[#364153]">
      <ProfileImage displayName={user.display_name} imageUrl={user.image_url} />

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-slate-800 truncate dark:text-gray-300">
          {user.display_name}
        </div>
        {user.bio && <p className="text-sm text-slate-500 line-clamp-1">{user.bio}</p>}
      </div>

      <button
        type="button"
        className="px-4 py-1.5 rounded-full bg-linear-to-r from-[#A8E0FF] to-[#C5C8FF] dark:from-[#6B8FA3] dark:to-[#7A8FB8] text-slate-700 dark:text-slate-300 text-sm font-semibold hover:opacity-90 active:scale-[.99] transition cursor-pointer select-none"
      >
        팔로우
      </button>
    </article>
  );
}
