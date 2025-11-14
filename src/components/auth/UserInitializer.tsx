"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useStore";
import type { Database } from "@/utils/supabase/supabase";

type Profile = Database["public"]["Tables"]["users"]["Row"];

interface UserInitializerProps {
  initialProfile?: Profile | null;
}

// 유저 프로필 초기화 Loader 역할
export function UserInitializer({ initialProfile }: UserInitializerProps) {
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser, initialProfile]);

  return null;
}
