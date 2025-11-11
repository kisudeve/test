"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

type PresenceContextType = {
  currentUsers: number;
};

const PresenceContext = createContext<PresenceContextType | undefined>(undefined);

interface PresenceProviderProps {
  children: ReactNode;
  channelName?: string;
}

export function PresenceProvider({ children, channelName = "dashboard" }: PresenceProviderProps) {
  const [currentUsers, setCurrentUsers] = useState(1);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const supabase = createClient();
  const isInitializedRef = useRef(false);

  // 중복 로그인을 방지한 고유 계정 아이디 계산
  const uniqueUsersCount = useCallback((channel: RealtimeChannel) => {
    const state = channel.presenceState(); // 상태 관리
    const uniqueUsers = new Set<string>(); // 고유 유저 아이디 관리

    Object.values(state).forEach((presences) => {
      if (Array.isArray(presences)) {
        presences.forEach((presence) => {
          if (
            typeof presence === "object" &&
            presence !== null &&
            "user_id" in presence &&
            typeof presence.user_id === "string"
          ) {
            uniqueUsers.add(presence.user_id);
          }
        });
      }
    });

    return uniqueUsers.size;
  }, []);

  useEffect(() => {
    // 중복 방지
    if (isInitializedRef.current) return;

    const isMounted = true;
    let channel: RealtimeChannel | null = null;

    // 현재 사용자 정보 가져오기 및 Presence 설정
    const setupPresence = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !isMounted) {
        if (isMounted) {
          setCurrentUsers(0);
        }
        return;
      }

      channel = supabase.channel(channelName, {
        config: {
          presence: {
            key: user.id, // 고유키로 인한 중복 방지
          },
        },
      });

      channel
        .on("presence", { event: "sync" }, () => {
          if (!isMounted || !channel) return;
          const count = uniqueUsersCount(channel);
          setCurrentUsers(count);
        })
        .on("presence", { event: "join" }, () => {
          if (!isMounted || !channel) return;
          const count = uniqueUsersCount(channel);
          setCurrentUsers(count);
        })
        .on("presence", { event: "leave" }, () => {
          if (!isMounted || !channel) return;
          const count = uniqueUsersCount(channel);
          setCurrentUsers(count);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED" && channel && isMounted) {
            try {
              await channel.track({
                user_id: user.id,
                online_at: new Date().toISOString(),
              });
            } catch (error) {
              console.error("Presence 추적 설정 중 오류:", error);
            }
          }
        });

      channelRef.current = channel;
      isInitializedRef.current = true;
    };

    setupPresence().catch((error) => {
      console.error("Presence 설정 중 오류:", error);
    });

    return () => {
      // 페이지 이동 시에도 채널 유지할 것이기에 정의 X
    };
  }, [channelName, supabase, uniqueUsersCount]);

  // 페이지를 닫거나, 종료하는 경우만 채널 삭제
  useEffect(() => {
    const handleUnload = () => {
      if (channelRef.current) {
        channelRef.current
          .untrack()
          .then(() => {
            if (channelRef.current) {
              supabase.removeChannel(channelRef.current);
            }
          })
          .catch((error) => {
            console.error("Presence 채널 삭제 중 오류:", error);
          });
      }
    };

    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, [supabase]);

  const value: PresenceContextType = {
    currentUsers,
  };

  return <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>;
}

export function usePresenceContext() {
  const context = useContext(PresenceContext);
  if (context === undefined) {
    throw new Error("usePresenceContext must be used within a PresenceProvider");
  }
  return context;
}
