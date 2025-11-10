export default function PostDetailSkeleton() {
  return (
    <section className="m-10 p-10 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white border border-slate-200">
      <div className="animate-pulse">
        <div className="h-20 bg-slate-200 rounded"></div>
        <div className="h-40 bg-slate-200 rounded mt-4"></div>
      </div>
    </section>
  );
}