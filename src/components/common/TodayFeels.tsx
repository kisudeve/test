import { setTrendTagsRank } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import { toast } from "sonner";
import { EmotionBadge } from "@/components/community/EmotionIcon";

export const revalidate = 3600;

export default async function TodayFeels() {
  // 오늘 날짜 범위
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // 어제 날짜 범위
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const yesterdayEnd = new Date(todayEnd);
  yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

  const supabase = await createClient();

  // 오늘 데이터 가져오기
  const { data: todayHashtags, error: todayError } = await supabase
    .from("hashtags")
    .select("content, created_at")
    .gte("created_at", todayStart.toISOString())
    .lte("created_at", todayEnd.toISOString());

  // 어제 데이터 가져오기
  const { data: yesterdayHashtags, error: yesterdayError } = await supabase
    .from("hashtags")
    .select("content, created_at")
    .gte("created_at", yesterdayStart.toISOString())
    .lte("created_at", yesterdayEnd.toISOString());

  if (todayError || yesterdayError) {
    toast.error("오늘의 감정을 불러오기 실패했습니다.");
    return null;
  }

  const todayRanks = setTrendTagsRank(todayHashtags || [], 3);
  const yesterdayRanks = setTrendTagsRank(yesterdayHashtags || [], yesterdayHashtags.length);

  // 퍼센트 변화 계산 함수
  const calculatePercentageChange = (tag: string, todayCount: number) => {
    const yesterdayItem = yesterdayRanks.find((item) => item.tag === tag);
    const yesterdayCount = yesterdayItem ? yesterdayItem.count : 0;

    if (yesterdayCount === 0) {
      return todayCount > 0 ? "+100%" : "0%";
    }

    const change = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
    const sign = change > 0 ? "+" : "";
    return `${sign}${Math.round(change)}%`;
  };

  const ranksWithPercentage = todayRanks.map((rank) => ({
    ...rank,
    percentageChange: calculatePercentageChange(rank.tag, rank.count),
  }));
  
  return (
    <section className="flex flex-col gap-3 p-6 bg-white border border-slate-200 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
      <h2 className="text-lg font-bold text-slate-900">오늘의 감정 TOP3</h2>
      <div className="flex flex-col gap-4">
        {ranksWithPercentage.map((rank, index) => (
          <div key={rank.tag} className="flex items-center gap-4 hover:opacity-70 cursor-pointer">
            <span className="w-3 text-slate-500 text-lg">{index + 1}</span>
            <EmotionBadge emotion={rank.tag} />
            <div className="flex flex-col">
              <strong className="font-medium">{rank.tag}</strong>
              <span
                className={`text-xs ${
                  rank.percentageChange.startsWith("+")
                    ? "text-green-500"
                    : rank.percentageChange.startsWith("-")
                      ? "text-red-500"
                      : "text-blue-500"
                }`}
              >
                {rank.percentageChange}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
