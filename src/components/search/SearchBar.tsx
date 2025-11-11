"use client";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="rounded-xl bg-white border border-slate-200 p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="감정, 태그, 사람을 검색해보세요"
        className="w-full outline-none text-sm text-slate-700"
      />
    </form>
  );
}
