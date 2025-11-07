import { Suspense } from "react";
import Sidebar from "@/components/common/Sidebar";
import { DashboardContent, DashboardSkeleton } from "@/components/dashboard";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 좌측 헤더 패널 */}
      <Sidebar />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 ml-64">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  );
}
