import { Suspense } from "react";
import { DashboardContent, DashboardSkeleton } from "@/components/dashboard";
import Header from "@/components/common/Header";
import { getUserProfile, getTodayScore } from "@/utils/actions";

export default async function Page() {
  // 프로필, 오늘의 지수
  const [userProfile, todayScore] = await Promise.all([getUserProfile(), getTodayScore()]);

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <div className="py-6 pl-4 w-[18%] min-w-[180px] shrink-0 sticky top-0 h-screen overflow-y-auto overflow-x-hidden">
        <Header initialProfile={userProfile} todayScore={todayScore} />
      </div>
      <main className="flex-1 min-w-0">
        <div className="w-full h-screen bg-gray-50 overflow-auto">
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
