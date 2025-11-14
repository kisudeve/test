import WriteDetail from "@/components/write/WriteDetail";
import { Suspense } from "react";

export default function WritePage() {
  return (
    <>
      <Suspense fallback={<div className="flex justify-center items-center">로딩중 ...</div>}>
        <div className="w-full h-full py-6 px-6">
          <WriteDetail />
        </div>
      </Suspense>
    </>
  );
}
