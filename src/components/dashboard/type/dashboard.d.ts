import { Database } from "@/utils/supabase/supabase";

// 실제 데이터 
export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];


// 더미 데이터
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