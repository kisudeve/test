"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import { fetchDashboardData, type DashboardData } from "@/components/dashboard/model/dashboard";
import DashboardChart from "./DashboardChart";
import DashboardStats from "./DashboardStats";

const POLLING_INTERVAL = 5 * 60 * 1000; // 5분 (밀리초)

interface DashboardContentWrapperProps {
  initialData: DashboardData;
}

export default function DashboardContentWrapper({ initialData }: DashboardContentWrapperProps) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [isPending, startTransition] = useTransition();

  // 데이터 로드 함수
  const loadData = useCallback(() => {
    startTransition(async () => {
      try {
        const newData = await fetchDashboardData();
        setData(newData);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    });
  }, [startTransition]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadData();
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [loadData]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="w-full space-y-6">
        {/* 상단 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">안녕하세요, OOO님</h1>
          <DashboardChart chartData={data.chartData} />
        </div>
        {/* 하단 부분*/}
        <DashboardStats data={data} />
      </div>
    </div>
  );
}
