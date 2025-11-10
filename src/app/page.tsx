import { Suspense } from "react";
import { DashboardContent, DashboardSkeleton } from "@/components/dashboard";

export default function Page() {
  return (
    <div className="w-full h-screen bg-gray-50 overflow-auto">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
