"use server";

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

// 깃허브 로그인
export const githubLogin = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
};

// 구글 로그인
export const googleLogin = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
};

// 디스코드 로그인
export const discordLogin = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
};

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
}

export async function save(userId: string, displayName: string, bio: string) {
  "use server";

  const supabase = await createClient();

  if (!displayName || !bio) {
    throw new Error("닉네임과 자기소개를 모두 입력해주세요.");
  }

  await supabase
    .from("users")
    .update({ display_name: displayName.trim(), bio: bio.trim() })
    .eq("id", userId);

  redirect(`/profile/${userId}`);
}
