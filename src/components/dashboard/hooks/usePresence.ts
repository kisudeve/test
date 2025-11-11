"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function usePresence(channelName: string = "online-users"): number {
  const [currentUsers, setCurrentUsers] = useState(1);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabase = createClient();

  // Presence 상태에서 고유한 사용자 수를 계산하는 함수
  const calculateUniqueUsers = useCallback((channel: RealtimeChannel) => {
    const state = channel.presenceState();
    const uniqueUsers = new Set<string>();

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
    let isMounted = true;
    let channel: RealtimeChannel | null = null;

    // 현재 사용자 정보 가져오기 및 Presence 설정
    const setupPresence = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // console.log("현재 접속중인 user", user);

      if (!user || !isMounted) {
        if (isMounted) {
          setCurrentUsers(0);
        }
        return;
      }

      channel = supabase.channel(channelName, {
        config: {
          presence: {
            key: user.id, // 고유키로 인한중복 방지
          },
        },
      });

      channel
        .on("presence", { event: "sync" }, () => {
          if (!isMounted || !channel) return;
          const count = calculateUniqueUsers(channel);
          setCurrentUsers(count);
        })
        .on("presence", { event: "join" }, () => {
          if (!isMounted || !channel) return;
          const count = calculateUniqueUsers(channel);
          setCurrentUsers(count);
        })
        .on("presence", { event: "leave" }, () => {
          if (!isMounted || !channel) return;
          const count = calculateUniqueUsers(channel);
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
    };

    setupPresence().catch((error) => {
      console.error("Presence 설정 중 오류:", error);
    });

    // 클린업 함수
    return () => {
      isMounted = false;
      if (channelRef.current) {
        channelRef.current
          .untrack()
          .then(() => {
            if (channelRef.current) {
              supabase.removeChannel(channelRef.current);
            }
          })
          .catch((error) => {
            console.error("Presence 채널 정리 중 오류:", error);
          });
        channelRef.current = null;
      }
    };
  }, [channelName, supabase, calculateUniqueUsers]);

  return currentUsers;
}

