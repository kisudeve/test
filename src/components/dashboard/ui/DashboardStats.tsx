"use client";

import { Lightbulb } from "lucide-react";
import type { DashboardData } from "@/components/dashboard/type/dashboard";
import DashboardCards from "@/components/dashboard/ui/DashboardCards";

interface DashboardStatsProps {
  data: DashboardData;
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  return (
    <>
      {/* 시장 요약 카드 */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Lightbulb className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                오늘의 감정 시장지수 요약
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                개미들은 오늘 소폭 상승장을 경험하고 있습니다. 긍정적인 신호가 많네요!
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">최근 업데이트</p>
            <p className="text-sm font-medium text-gray-700">{data.lastUpdated}</p>
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
