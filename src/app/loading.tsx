export default function Loading() {
  return (
    <>
      <div className="w-full h-screen gap-3 pt-40 pb-40 relative flex items-center justify-center animate-pulse">
        <div className="flex flex-col items-center animate-[bounce_1s_ease-in-out_infinite_0.1s]">
          <div className="w-1 h-6 bg-blue-200"></div>
          <div className="w-3 h-12 bg-blue-200 rounded-sm"></div>
          <div className="w-1 h-6 bg-blue-200"></div>
        </div>

        <div className="flex flex-col items-center animate-[bounce_1s_ease-in-out_infinite_0.2s]">
          <div className="w-1 h-6 bg-violet-200"></div>
          <div className="w-3 h-12 bg-violet-200 rounded-sm"></div>
          <div className="w-1 h-6 bg-violet-200"></div>
        </div>

        <div className="flex flex-col items-center animate-[bounce_1s_ease-in-out_infinite_0.1s]">
          <div className="w-1 h-6 bg-purple-200"></div>
          <div className="w-3 h-12 bg-purple-200 rounded-sm"></div>
          <div className="w-1 h-6 bg-purple-200"></div>
        </div>
      </div>
    </>
  );
}
