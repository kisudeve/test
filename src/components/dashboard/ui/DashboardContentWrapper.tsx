"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchDashboardData } from "@/components/dashboard/model/dashboard";
import type { DashboardData } from "@/components/dashboard/type/dashboard";
import DashboardChart from "@/components/dashboard/ui/DashboardChart";
import DashboardStats from "@/components/dashboard/ui/DashboardStats";

const POLLING_INTERVAL = 5 * 60 * 1000; // 5분 (밀리초)

interface DashboardContentWrapperProps {
  initialData: DashboardData;
}

export default function DashboardContentWrapper({ initialData }: DashboardContentWrapperProps) {
  const [data, setData] = useState<DashboardData>(initialData);

  const loadData = useCallback(async () => {
    try {
      const newData = await fetchDashboardData();
      setData(newData);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadData();
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [loadData]);

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="w-full space-y-6">
        {/* 상단 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-16 p-4">
            안녕하세요, OOO님
          </h1>
          <DashboardChart chartData={data.chartData} />
        </div>
        {/* 하단 부분*/}
        <DashboardStats data={data} />
      </div>
    </div>
  );
}
