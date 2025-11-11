"use client";
import ProfileImage from "@/components/common/ProfileImage";
import type { SearchUser } from "./types";

export default function SearchUserItem({ user }: { user: SearchUser }) {
  return (
    <article className="p-4 rounded-2xl bg-white border border-slate-200 flex gap-3 items-center">
      <ProfileImage displayName={user.display_name} imageUrl={user.image_url} />
      <div className="flex-1">
        <div className="font-semibold text-slate-800">{user.display_name}</div>
        {user.bio && <p className="text-sm text-slate-500 line-clamp-1">{user.bio}</p>}
      </div>
    </article>
  );
}
