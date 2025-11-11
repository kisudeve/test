type Tab = "posts" | "users" | "tags";

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
        "relative select-none px-3 py-2 text-sm transition",
        "focus:outline-none focus-visible:underline",
        isActive ? "text-violet-600 font-semibold" : "text-slate-500 hover:text-slate-700",
      ].join(" ")}
    >
      <span className="inline-flex items-center gap-2">
        <span>{label}</span>
        <span
          className={[
            "px-2 py-0.5 rounded-full text-[12px] leading-none",
            isActive ? "bg-violet-100 text-violet-600" : "bg-slate-100 text-slate-400",
          ].join(" ")}
        >
          {count}
        </span>
      </span>
      {/* underline indicator */}
      {isActive && (
        <span className="absolute left-0 -bottom-[9px] h-[3px] w-full bg-violet-500 rounded-full" />
      )}
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
  return (
    <div className="flex items-center gap-10 text-sm border-b border-slate-200 pb-2">
      <TabButton t="posts" label="게시물" count={counts.posts} active={active} onChange={onChange} />
      <TabButton t="users" label="사용자" count={counts.users} active={active} onChange={onChange} />
      <TabButton t="tags" label="태그" count={counts.tags} active={active} onChange={onChange} />
    </div>
  );
}
