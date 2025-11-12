"use server";

// 더미데이터 영역이기에 추후 작업 시 변동 될 가능성 있습니다.

import { createClient } from "@/utils/supabase/server";
import type { DashboardData, ChartDataPoint, Post, Comment } from "@/components/dashboard/type/dashboard";
import type { Database } from "@/utils/supabase/supabase";

type Hashtag = Database["public"]["Tables"]["hashtags"]["Row"];

// 대시보드 데이터 페칭 함수
export async function fetchDashboardData(currentUsers?: number): Promise<DashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 스켈레톤 디자인 확인

  const now = new Date(); // 오늘 날짜 담는 변수
  const supabase = await createClient();

  // 게시글 갯수
  const { count: postsCount, error: postsError } = await supabase
    .from("posts")
    .select<"*", Post>("*", { count: "exact", head: true });

  if (postsError) {
    console.error("Failed to fetch posts count:", postsError);
  }

  // 댓글 갯수
  const { count: commentsCount, error: commentsError } = await supabase
    .from("comments")
    .select<"*", Comment>("*", { count: "exact", head: true });

  if (commentsError) {
    console.error("Failed to fetch comments count:", commentsError);
  }

  // 해시태그 데이터
  const { data: hashtagsData, error: hashtagsError } = await supabase
    .from("hashtags")
    .select<"*", Hashtag>("*");

  if (hashtagsError) {
    console.error("Failed to fetch hashtags:", hashtagsError);
  }

  // 해시태그 집계 및 정렬
  const hashtagCounts = new Map<string, number>();
  const previousHashtagCounts = new Map<string, number>();

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 1);

  hashtagsData?.forEach((hashtag) => {
    const hashtagDate = new Date(hashtag.created_at);

    // 최근 1일 데이터 추출
    const isRecent = hashtagDate >= sevenDaysAgo;

    // 개별 해시태그 추출
    const tags = hashtag.content
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    tags.forEach((tag) => {
      if (isRecent) {
        hashtagCounts.set(tag, (hashtagCounts.get(tag) || 0) + 1);
      } else {
        previousHashtagCounts.set(tag, (previousHashtagCounts.get(tag) || 0) + 1);
      }
    });
  });

  // 모든 해시태그를 포함하여 증가율 계산 
  const allTags = new Set([
    ...hashtagCounts.keys(),
    ...previousHashtagCounts.keys(),
  ]);

  const hashtagTrends = Array.from(allTags).map((tag) => {
    const currentCount = hashtagCounts.get(tag) || 0;
    const previousCount = previousHashtagCounts.get(tag) || 0;

    let increaseRate: number;

    if (previousCount === 0) {
      // 어제는 없었지만 오늘 생긴 경우: 새로 생긴 해시태그
      increaseRate = currentCount > 0 ? currentCount * 100 : 0;
    } else if (currentCount === 0) {
      // 어제는 있었지만 오늘 사라진 경우: -100% 감소
      increaseRate = -100;
    } else {
      // 두 기간 모두 있는 경우: 표준 증가율 계산
      // 어제 2회, 오늘 3회 → ((3-2)/2) * 100 = +50%
      increaseRate = ((currentCount - previousCount) / previousCount) * 100;
    }

    return {
      name: `#${tag}`,
      change: `${increaseRate >= 0 ? "+" : ""}${increaseRate.toFixed(1)}%`,
      currentCount,
      previousCount,
      trend: increaseRate, // 증가율 기준으로 정렬
    };
  });

  // 증가율 기준으로 정렬
  const sortedTrends = hashtagTrends.sort((a, b) => b.trend - a.trend);
  console.log("sortedTrends", sortedTrends);

  // 상위 3개
  const topRising = sortedTrends
    .filter((item) => item.trend > 0)
    .slice(0, 3)
    .map(({ name, change }) => ({ name, change }));

  // 하위 3개 - 절댓값이 큰 순서
  const topFalling = sortedTrends
    .filter((item) => item.trend < 0)
    .slice(0, 3)
    .map(({ name, change }) => ({ name, change }));

  // 데이터가 부족한 경우 기본값 사용
  const finalTopRising = topRising.length > 0 ? topRising : [];
  const finalTopFalling = topFalling.length > 0 ? topFalling : [];

  const lastUpdated = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${now.getHours() >= 12 ? "오후" : "오전"} ${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, "0")}`;
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  const chartData: ChartDataPoint[] = Array.from({ length: 30 }, (_, idx) => {
    const dayOffset = 29 - idx; // 1개월 → 오늘
    const current = new Date(now);
    current.setHours(0, 0, 0, 0);
    current.setDate(current.getDate() - dayOffset);

    const trend = 100 + idx * 4;
    const wave = Math.round(15 * Math.sin((idx / 5) * Math.PI));
    const up = trend + wave;
    const down = 18 + ((idx * 7) % 28);
    const hold = 6 + ((idx * 4) % 14);

    return {
      date: current.toISOString(), // timestampz 형식
      day: current.getDate(),
      weekday: weekdays[current.getDay()],
      up,
      down,
      hold,
    };
  });

  // 대시보드 데이터 반환
  return {
    chartData,
    topRising: finalTopRising,
    topFalling: finalTopFalling,
    communityStats: {
      newPosts: `${postsCount || 0}개`,
      comments: `${commentsCount || 0}개`,
      currentUsers: `${currentUsers || 1}명`, // 실시간 접속자 수 (기본값: 1명)
    },
    lastUpdated,
  };
}

