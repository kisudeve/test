"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Button from "@/components/common/Button";
import ProfileImage from "@/components/common/ProfileImage";
import { signOut } from "./actions";
import { Users, UserCheck, PenSquare } from "lucide-react";

type Props = {
  isMe: boolean;
  profile: {
    id: string;
    name: string;
    bio: string;
    avatar: string | null;
    followerCount: number;
    followingCount: number;
    postCount: number;
    isFollowing: boolean;
  };
};

export default function ProfileHeader({ isMe, profile }: Props) {
  const [pending, start] = useTransition();

  const router = useRouter();

  const handleSignOut = () => {
    start(async () => {
      await signOut();
    });
  };

  return (
    <section className="w-full">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          <ProfileImage displayName={profile.name} imageUrl={profile.avatar ?? ""} size="xl" />

          <div className="pt-1">
            <h1 className="text-[22px] font-bold text-slate-900">{profile.name}</h1>
            <p className="mt-1 text-[13px] leading-5 text-slate-500">{profile.bio || " "}</p>

            <div className="mt-3 flex items-center gap-6 text-[13px]">
              <Stat
                icon={<Users className="h-4 w-4 text-slate-500" aria-hidden />}
                label="팔로워"
                value={profile.followerCount}
              />
              <Stat
                icon={<UserCheck className="h-4 w-4 text-slate-500" aria-hidden />}
                label="팔로잉"
                value={profile.followingCount}
              />
              <Stat
                icon={<PenSquare className="h-4 w-4 text-slate-500" aria-hidden />}
                label="작성글"
                value={profile.postCount}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {isMe ? (
            <>
              <Button
                variant="edit"
                className="px-3 py-1"
                onClick={() => router.push(`/profile/edit?mode=edit&return=/profile/${profile.id}`)}
              >
                수정
              </Button>
              <Button
                variant="common"
                className="px-3 py-1"
                onClick={handleSignOut}
                disabled={pending}
              >
                {pending ? "로그아웃 중…" : "로그아웃"}
              </Button>
            </>
          ) : (
            <div className="h-0" />
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | null | undefined;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-slate-600">
        {icon}
        <span>{label}</span>
      </div>
      <b className="tabular-nums ml-0.5 text-slate-900">{typeof value === "number" ? value : 0}</b>
    </div>
  );
}
