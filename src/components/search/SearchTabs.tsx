type Tab = "all" | "posts" | "users" | "tags";

export type { Tab };

const TabButton = ({
  t,
  label,
  count,
  active,
  onChange,
}: {
  t: Tab;
  label: string;
  count: number;
  active: Tab;
  onChange: (t: Tab) => void;
}) => {
  const isActive = active === t;

  return (
    <button
      type="button"
      onClick={() => onChange(t)}
      aria-pressed={isActive}
      className={[
        "inline-flex items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition cursor-pointer",
        isActive
          ? "bg-slate-900 text-white shadow-sm"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200",
      ].join(" ")}
    >
      <span>{label}</span>
      <span className="text-xs opacity-80">({count})</span>
    </button>
  );
};

export default function SearchTabs({
  active,
  counts,
  onChange,
}: {
  active: Tab;
  counts: { posts: number; users: number; tags: number };
  onChange: (t: Tab) => void;
}) {
  const total = counts.posts + counts.users + counts.tags;

  return (
    <div className="flex items-center gap-2 text-sm">
      <TabButton t="all" label="전체" count={total} active={active} onChange={onChange} />
      <TabButton
        t="posts"
        label="게시글"
        count={counts.posts}
        active={active}
        onChange={onChange}
      />
      <TabButton t="tags" label="태그" count={counts.tags} active={active} onChange={onChange} />
      <TabButton
        t="users"
        label="사용자"
        count={counts.users}
        active={active}
        onChange={onChange}
      />
    </div>
  );
}
