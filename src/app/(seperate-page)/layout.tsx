import Header from "@/components/common/Header";
import { getUserProfile, getTodayScore } from "@/utils/actions";

export default async function SeperateLayout({ children }: { children: React.ReactNode }) {
  // 프로필, 오늘의 지수
  const [userProfile, todayScore] = await Promise.all([getUserProfile(), getTodayScore()]);

  return (
    <div className="flex min-w-full min-h-screen">
      <div className="py-6 pl-4 w-[18%] min-w-[180px] shrink-0 sticky top-0 h-screen overflow-y-auto">
        <Header initialProfile={userProfile} todayScore={todayScore} />
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}

export const metadata = {
  title: "Public",
};
