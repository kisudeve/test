import { Heart, MessageCircle } from "lucide-react";

export default function PostListSkeleton() {
  return (
    <>
      <div className="p-5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white border border-slate-300">
        <div className="flex gap-4 pb-5 animate-pulse">
          <div className="rounded-full bg-slate-300 w-15 h-15"></div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <div className="w-30 h-6 bg-slate-300 rounded-sm"></div>
                <div className="w-20 h-4 bg-slate-300 rounded-sm"></div>
              </div>
              <div className="w-20 h-7 rounded-2xl bg-slate-300"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-2/3 h-7 bg-slate-300 rounded-sm"></div>
              <div className="w-3/4 h-6 bg-slate-300 rounded-sm"></div>
            </div>
          </div>
        </div>
        <div className="flex gap-5 border-t border-slate-300 pt-5 animate-pulse">
          <div className="flex items-center justify-center gap-1">
            <Heart size={18} className="stroke-slate-300 fill-slate-300" />
            <div className="w-5 h-4 bg-slate-300 rounded-sm"></div>
          </div>
          <div className="flex items-center justify-center gap-1">
            <MessageCircle size={16} className="stroke-slate-300 fill-slate-300" />
            <div className="w-5 h-4 bg-slate-300 rounded-sm"></div>
          </div>
        </div>
      </div>
    </>
  );
}
