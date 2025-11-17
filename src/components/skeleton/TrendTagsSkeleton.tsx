export default function TrendTagsSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-3 p-6 bg-white border border-slate-200 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
        <div className="w-2/3 h-7 rounded-sm bg-slate-300"></div>
        <div className="flex flex-wrap gap-2">
          <div className="w-20 h-9 bg-slate-300 rounded-4xl"></div>
          <div className="w-15 h-9 bg-slate-300 rounded-4xl"></div>
          <div className="w-18 h-9 bg-slate-300 rounded-4xl"></div>
          <div className="w-18 h-9 bg-slate-300 rounded-4xl"></div>
          <div className="w-22 h-9 bg-slate-300 rounded-4xl"></div>
          <div className="w-13 h-9 bg-slate-300 rounded-4xl"></div>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-6 bg-white border border-slate-200 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
        <div className="w-2/3 h-7 rounded-sm bg-slate-300"></div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-3 h-7 bg-slate-300 rounded-sm"></div>
            <div className="w-10 h-10 bg-slate-300 rounded-sm"></div>
            <div className="w-18 h-9 bg-slate-300 rounded-sm"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-3 h-7 bg-slate-300 rounded-sm"></div>
            <div className="w-10 h-10 bg-slate-300 rounded-sm"></div>
            <div className="w-18 h-9 bg-slate-300 rounded-sm"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-3 h-7 bg-slate-300 rounded-sm"></div>
            <div className="w-10 h-10 bg-slate-300 rounded-sm"></div>
            <div className="w-18 h-9 bg-slate-300 rounded-sm"></div>
          </div>
        </div>
      </div>
    </>
  );
}
