"use client";

import { Lightbulb } from "lucide-react";
import type { DashboardData } from "@/components/dashboard/type/dashboard";
import DashboardCards from "@/components/dashboard/ui/DashboardCards";

interface DashboardStatsProps {
  data: DashboardData;
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const formatLastUpdated = (lastUpdated: string) => {
    const match = lastUpdated.match(/^(.+일)\s+(.+)$/);
    if (match) {
      return {
        date: match[1], // 날짜
        time: match[2], // 시간
      };
    }
    // 에러 발생 시 기존 데이터 반환 ("YYYY년 MM월 DD일 HH:MM")
    return {
      date: lastUpdated,
      time: "",
    };
  };

  const { date, time } = formatLastUpdated(data.lastUpdated);

  return (
    <>
      {/* 시장 요약 카드 */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 min-h-40 flex items-center">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Lightbulb className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl md:text-2xl font-bold text-gray-800 mb-1">
                오늘의 감정 시장지수 요약
              </h2>
              <p className="text-gray-600 text-lg md:text-lg">
                개미들은 오늘 소폭 상승장을 경험하고 있습니다. 긍정적인 신호가 많네요!
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg md:text-lg text-gray-500 mb-1">최근 업데이트</p>
            <div className="text-lg md:text-lg font-medium text-gray-700">
              <p>{date}</p>
              {time && <p>{time}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 3개 카드 */}
      <DashboardCards
        topRising={data.topRising}
        topFalling={data.topFalling}
        communityStats={data.communityStats}
      />
    </>
  );
}
