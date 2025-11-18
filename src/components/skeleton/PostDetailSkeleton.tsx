import { Heart, MessageCircle } from "lucide-react";

export default function PostDetailSkeleton() {
  return (
    <section className="p-10 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="flex gap-4">
          <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-15 h-15"></div>
          <div className="flex-1 flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <div className="w-30 h-7 bg-slate-300 dark:bg-slate-700 rounded-sm"></div>
              <div className="w-20 h-5 bg-slate-300 dark:bg-slate-700 rounded-sm"></div>
            </div>
            <div className="w-20 h-7 rounded-2xl bg-slate-300 dark:bg-slate-700"></div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="w-2/3 h-7 bg-slate-300 dark:bg-slate-700 rounded-sm"></div>
          <div className="w-full h-6 bg-slate-300 dark:bg-slate-700 rounded-sm"></div>
        </div>
        <div className="flex gap-5 border-t border-slate-300 pt-5">
          <div className="flex items-center justify-center gap-1">
            <Heart
              size={18}
              className="stroke-slate-300 fill-slate-300 dark:stroke-slate-700 dark:fill-slate-700"
            />
            <div className="w-5 h-4 bg-slate-300 dark:bg-slate-700 rounded-sm"></div>
          </div>
          <div className="flex items-center justify-center gap-1">
            <MessageCircle
              size={16}
              className="stroke-slate-300 fill-slate-300 dark:stroke-slate-700 dark:fill-slate-700"
            />
            <div className="w-5 h-4 bg-slate-300 dark:bg-slate-700 rounded-sm"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
