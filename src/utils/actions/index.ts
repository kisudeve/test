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

// 서버에서 사용자 프로필 가져오기
export async function getUserProfile() {
  const supabase = await createClient();

  try {
    // 현재 사용자 확인
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    // 프로필 정보 가져오기
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return profile;
  } catch (error) {
    console.error("프로필 데이터 로딩 오류:", error);
    return null;
  }
}