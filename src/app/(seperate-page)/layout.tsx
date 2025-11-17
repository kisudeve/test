import Header from "@/components/common/Header";
import { getUserProfile, getTodayScore } from "@/utils/actions";

export default async function SeperateLayout({ children }: { children: React.ReactNode }) {
  // 프로필, 오늘의 지수
  const [userProfile, todayScore] = await Promise.all([getUserProfile(), getTodayScore()]);

  return (
    <div className="flex min-w-full min-h-full">
      <Header initialProfile={userProfile} todayScore={todayScore} />
      <main className="flex-1 p-6 pt-25 xl:pt-6 min-h-screen">{children}</main>
    </div>
  );
}
