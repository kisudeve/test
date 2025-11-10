export default function PostCommentSkeleton() {
  return (
    <section className="m-10 p-10 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white border border-slate-200">
      <div className="animate-pulse">
        <div className="h-10 bg-slate-200 rounded-lg"></div>
        <div className="h-20 bg-slate-200 rounded-lg mt-4"></div>
        <div className="h-20 bg-slate-200 rounded-lg mt-4"></div>
      </div>
    </section>
  );
}
