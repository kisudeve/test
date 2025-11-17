import { Suspense } from "react";
import { DashboardContent, DashboardSkeleton } from "@/components/dashboard";
import Header from "@/components/common/Header";
import { getUserProfile, getTodayScore } from "@/utils/actions";

export default async function Page() {
  // 프로필, 오늘의 지수
  const [userProfile, todayScore] = await Promise.all([getUserProfile(), getTodayScore()]);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
