import ProfileSkeleton from "@/components/skeleton/ProfileSkeleton";

export default function Loading() {
  return (
    <div className="w-full space-y-6 dark:bg-[#141c2c]">
      <ProfileSkeleton />
    </div>
  );
}
