"use server";

// 차트 데이터 타입 정의 (더미 데이터 기준)
export interface ChartDataPoint {
  date: string;
  day: number;
  weekday: string;
  up: number;
  down: number;
  hold: number;
}

// 대시보드 데이터 타입 정의 (더미 데이터 기준)
export interface DashboardData {
  chartData: ChartDataPoint[];
  topRising: Array<{ name: string; change: string }>;
  topFalling: Array<{ name: string; change: string }>;
  communityStats: {
    newPosts: string;
    comments: string;
    currentUsers: string;
  };
  lastUpdated: string;
}

// 대시보드 데이터 페칭 함수 (더미 데이터 사용)
export async function fetchDashboardData(): Promise<DashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 스켈레톤 디자인 확인

  const now = new Date();
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

  return {
    chartData,
    topRising: [
      { name: "#설렘", change: "+15.2%" },
      { name: "#설렘", change: "+15.2%" },
      { name: "#설렘", change: "+15.2%" },
    ],
    topFalling: [
      { name: "#피곤", change: "+15.2%" },
      { name: "#슬픔", change: "+15.2%" },
      { name: "#분노", change: "+15.2%" },
    ],
    communityStats: {
      newPosts: "1,204개",
      comments: "5,832개",
      currentUsers: "3,450명",
    },
    lastUpdated,
  };
}

