import TodayFeels from "@/components/common/TodayFeels";
import TrendTags from "@/components/common/TrendTags";

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="py-6 px-4 flex-1 flex flex-col gap-6">{children}</div>
      <div className="w-[21.95%] min-w-[180px] py-6 pr-4">
        <div className="flex flex-col sticky top-6 gap-4">
          <TrendTags />
          <TodayFeels />
        </div>
      </div>
    </div>
  );
}
