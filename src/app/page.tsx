import { Suspense } from "react";
import { DashboardContent, DashboardSkeleton } from "@/components/dashboard";
import Header from "@/components/common/Header";
import { getUserProfile, getTodayScore } from "@/utils/actions";

export default async function Page() {
  // 프로필 데이터 가져오기
  const userProfile = await getUserProfile();
  // 오늘의 감정 지수 가져오기
  const todayScore = await getTodayScore();

  return (
    <div className="flex min-h-screen">
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
