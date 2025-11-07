import { Suspense } from "react";
import Sidebar from "@/components/common/Sidebar";
import { DashboardContent, DashboardSkeleton } from "@/components/dashboard";

export default function Page() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("1주");
  const [hoveredDate, setHoveredDate] = useState<string | null>("Wed 17");

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
