import TodayFeels from "@/components/common/TodayFeels";
import TrendTags from "@/components/common/TrendTags";
import TrendTagsSkeleton from "@/components/skeleton/TrendTagsSkeleton";
import { Suspense } from "react";

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="p-6 flex-1 flex flex-col gap-6">{children}</div>
      <div className="w-[21.95%] min-w-[180px] py-6 pr-4">
        <div className="flex flex-col sticky top-6 gap-4">
          <Suspense fallback={<TrendTagsSkeleton />}>
            <TrendTags />
            <TodayFeels />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
