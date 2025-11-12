"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/utils/supabase/supabase";

type Profile = Database["public"]["Tables"]["users"]["Row"];

type UserState = {
  profile: Profile | null;
  loading: boolean;
};

type UserAction = {
  fetchUser: () => Promise<void>;
  setProfile: (profile: Profile | null) => void;
  resetUser: () => void;
};

type UserStore = UserState & UserAction;

export const useUserStore = create<UserStore>()(
  devtools(
    (set, get) => ({
      profile: null,
      loading: true,

      // 사용자 정보 가져오기
      fetchUser: async () => {
        const supabase = createClient();

        try {
          set({ loading: true });

          // 현재 사용자 확인
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            set({
              profile: null,
              loading: false,
            });
            return;
          }

          const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profileError || !profile) {
            set({
              profile: null,
              loading: false,
            });
            return;
          }

          set({
            profile: profile as Profile,
            loading: false,
          });
        } catch (error) {
          console.error("사용자 정보 가져오기 실패:", error);
          set({
            profile: null,
            loading: false,
          });
        }
      },

      setProfile: (profile) => {
        set({
          profile,
          loading: false,
        });
      },

      resetUser: () => {
        set({
          profile: null,
          loading: false,
        });
      },
    }),
    {
      name: "user-store",
    },
  ),
);

// 유저 프로필
export const useProfile = () => useUserStore((state) => state.profile);
// 유저 이름 (display_name 참조이기에 참고해둘 것)
export const useUserName = () => useUserStore((state) => state.profile?.display_name);
// 유저 로그인 상태 여부 
export const useIsLoggedIn = () => useUserStore((state) => !!state.profile);
// 유저 아이디
export const useUserId = () => useUserStore((state) => state.profile?.id);

