"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useStore";

// 유저 프로필 초기화 Loader 역할
export function UserInitializer() {
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return null;
}
