import PostListSkeleton from "./PostListSkeleton";

export default function ProfileSkeleton() {
  return (
    <div className="w-full px-6 py-6 space-y-6">
     
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-6 animate-pulse">
     
          <div className="w-20 h-20 rounded-full bg-slate-300" />

          <div className="flex-1 space-y-3">
            
            <div className="w-40 h-6 bg-slate-300 rounded-sm" />
           
            <div className="w-64 h-4 bg-slate-300 rounded-sm" />

          
            <div className="flex gap-4 mt-2">
              <div className="w-20 h-4 bg-slate-300 rounded-sm" />
              <div className="w-20 h-4 bg-slate-300 rounded-sm" />
              <div className="w-20 h-4 bg-slate-300 rounded-sm" />
            </div>
          </div>

         
          <div className="w-24 h-9 rounded-2xl bg-slate-300" />
        </div>
      </section>

  
      <section className="rounded-2xl bg-white p-6 shadow-sm">
      
        <div className="mb-4 h-6 w-24 bg-slate-300 rounded-sm animate-pulse" />
      
        <div className="h-60 w-full rounded-xl bg-slate-200 animate-pulse" />
      </section>

      
      <section className="space-y-4">
        <PostListSkeleton />
        <PostListSkeleton />
        <PostListSkeleton />
      </section>
    </div>
  );
}
