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

  return {
    chartData: [
      { date: "Mon 15", day: 15, weekday: "Mon", up: 36, down: 20, hold: 0 },
      { date: "Tue 16", day: 16, weekday: "Tue", up: 110, down: 15, hold: 5 },
      { date: "Wed 17", day: 17, weekday: "Wed", up: 245, down: 11, hold: 0 },
      { date: "Thu 18", day: 18, weekday: "Thu", up: 170, down: 18, hold: 2 },
      { date: "Fri 19", day: 19, weekday: "Fri", up: 220, down: 10, hold: 0 },
      { date: "Sat 20", day: 20, weekday: "Sat", up: 87, down: 15, hold: 5 },
      { date: "Sun 21", day: 21, weekday: "Sun", up: 139, down: 12, hold: 3 },
      { date: "Mon 22", day: 22, weekday: "Mon", up: 201, down: 8, hold: 0 },
    ],
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

