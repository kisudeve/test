export default function SearchTabs({
  postCount,
  userCount,
  tagCount,
}: {
  postCount: number;
  userCount: number;
  tagCount: number;
}) {
  return (
    <div className="flex items-center gap-6 text-sm text-slate-500">
      <span className="font-semibold text-slate-800">게시물 {postCount}</span>
      <span>사용자 {userCount}</span>
      <span>태그 {tagCount}</span>
    </div>
  );
}
